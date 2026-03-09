"use client";

import UploadForm from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Data Upload Center</h1>
        <UploadForm />
      </div>
    </div>
  );
}
