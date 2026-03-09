import { DocumentUpload } from "@/components/upload/DocumentUpload";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
          <p className="text-gray-600">
            Upload PDF documents to the political finance system for processing and analysis
          </p>
        </div>
        
        <DocumentUpload />
      </div>
    </div>
  );
}
