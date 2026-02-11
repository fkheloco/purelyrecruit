import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const { userId } = await auth();
    
    if (userId) {
      redirect("/recruiter/dashboard");
    }
  } catch (error) {
    // Auth not available during build
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Purely <span className="text-[#455E7F]">Recruit</span>
          </h1>
          <p className="mt-2 text-lg text-[#D7A839] font-medium">AI-Powered Recruiting Platform</p>
        </div>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Score candidates with AI, manage talent pipelines, and make smarter hiring decisions — all in one platform.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/sign-in"
            className="rounded-lg bg-[#455E7F] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#3a5170] transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Create Account
          </Link>
          <Link
            href="/jobs"
            className="text-sm font-semibold leading-6 text-[#455E7F] hover:underline"
          >
            Browse Jobs →
          </Link>
        </div>

        <p className="mt-16 text-xs text-gray-400">
          Built by Purely Works — Helping You Build Smarter with AI
        </p>
      </div>
    </div>
  );
}
