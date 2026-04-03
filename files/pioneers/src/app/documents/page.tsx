import { DocumentList } from "@/components/documents/DocumentList";

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">
            View, manage, and track the status of uploaded documents in the political finance system
          </p>
        </div>
        
        <DocumentList />
      </div>
    </div>
  );
}
