"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon, UploadCloudIcon } from "lucide-react";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

type ApplicationStep = "personal" | "resume" | "cover-letter" | "review" | "success";

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export default function TenantApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const tenant = params.tenant as string;

  const [tenantData, setTenantData] = useState<any>(null);
  const [step, setStep] = useState<ApplicationStep>("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    resumeUrl: "",
    coverLetter: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    // Fetch tenant data for branding
    const fetchTenant = async () => {
      try {
        const response = await fetch(`/api/tenants?slug=${tenant}`);
        if (response.ok) {
          const data = await response.json();
          setTenantData(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch tenant", err);
      }
    };

    fetchTenant();
  }, [tenant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeUpload = async (file: File) => {
    if (!file) return;

    setResumeFile(file);
    setUploadingResume(true);
    setError(null);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        resumeUrl: data.url,
      }));
    } catch (err) {
      setError("Failed to upload resume. Please try again.");
      setResumeFile(null);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleNext = async () => {
    setError(null);

    if (step === "personal") {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all required fields");
        return;
      }
      setStep("resume");
    } else if (step === "resume") {
      if (!formData.resumeUrl) {
        setError("Please upload a resume");
        return;
      }
      setStep("cover-letter");
    } else if (step === "cover-letter") {
      setStep("review");
    } else if (step === "review") {
      await submitApplication();
    }
  };

  const handleBack = () => {
    if (step === "resume") setStep("personal");
    else if (step === "cover-letter") setStep("resume");
    else if (step === "review") setStep("cover-letter");
  };

  const submitApplication = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create candidate
      const candidateRes = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          locationCity: formData.city,
          locationState: formData.state,
          source: "tenant_career_site",
        }),
      });

      if (!candidateRes.ok) {
        throw new Error("Failed to create candidate profile");
      }

      const candidateData = await candidateRes.json();
      const candidateId = candidateData.data.id;

      // Create application
      const appRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          jobOpeningId: jobId,
          resumeUrl: formData.resumeUrl,
          coverLetter: formData.coverLetter,
          source: "career_site",
        }),
      });

      if (!appRes.ok) {
        throw new Error("Failed to submit application");
      }

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying. The team at {tenantData?.name} will review your application and be in touch soon.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/${tenant}/jobs`}
              className="rounded-lg px-6 py-3 font-semibold text-white transition"
              style={{ backgroundColor: tenantData?.primaryColor || "#455E7F" }}
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryColor = tenantData?.primaryColor || "#455E7F";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/${tenant}/jobs/${jobId}`}
        className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition"
        style={{ color: primaryColor }}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Job
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply to {tenantData?.name}</h1>
        <p className="text-gray-600 mb-8">
          Step {step === "personal" ? "1" : step === "resume" ? "2" : step === "cover-letter" ? "3" : "4"} of 4
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {step === "personal" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleInputChange}
                className="col-span-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primaryColor + "40" } as any}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleInputChange}
                className="col-span-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primaryColor + "40" } as any}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": primaryColor + "40" } as any}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": primaryColor + "40" } as any}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="col-span-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primaryColor + "40" } as any}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="col-span-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primaryColor + "40" } as any}
              />
            </div>
          </div>
        )}

        {step === "resume" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Upload Your Resume</h2>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleResumeUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                {uploadingResume ? (
                  <>
                    <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-[color] mx-auto mb-2" style={{ borderTopColor: primaryColor }}></div>
                    <p className="text-sm font-medium text-gray-700">Uploading...</p>
                  </>
                ) : resumeFile ? (
                  <>
                    <CheckCircleIcon className="mx-auto h-10 w-10 text-green-600 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Uploaded: {resumeFile.name}</p>
                    <p className="text-xs text-gray-500">Click to change file</p>
                  </>
                ) : (
                  <>
                    <UploadCloudIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 10MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {step === "cover-letter" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Cover Letter (Optional)</h2>
            <textarea
              name="coverLetter"
              placeholder="Tell us about yourself and why you're interested in this position..."
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={8}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": primaryColor + "40" } as any}
            />
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Review Your Application</h2>
            <div className="space-y-4 rounded-lg bg-gray-50 p-6">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                <p className="text-gray-900">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                <p className="text-gray-900">{formData.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                <p className="text-gray-900">{formData.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                <p className="text-gray-900">
                  {formData.city}, {formData.state}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Resume</p>
                <p className="text-gray-900">{resumeFile?.name || "Uploaded"}</p>
              </div>
              {formData.coverLetter && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Cover Letter</p>
                  <p className="text-gray-900 whitespace-pre-wrap text-sm">{formData.coverLetter}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step !== "personal" && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              disabled={isLoading}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isLoading || uploadingResume}
            className="flex-1 rounded-lg px-6 py-2 font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: primaryColor }}
          >
            {isLoading
              ? "Submitting..."
              : step === "review"
              ? "Submit Application"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
