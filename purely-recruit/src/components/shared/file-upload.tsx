"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  label?: string;
}

export function FileUpload({ onUpload, accept = ".pdf,.doc,.docx", label = "Upload Resume" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);
    try {
      await onUpload(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-blue-400 hover:bg-blue-50"
    >
      <Upload className="h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm font-medium text-gray-600">
        {isUploading ? "Uploading..." : fileName || label}
      </p>
      <p className="mt-1 text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
