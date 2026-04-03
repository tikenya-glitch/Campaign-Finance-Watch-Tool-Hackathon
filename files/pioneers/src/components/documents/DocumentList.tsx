"use client";

import { useState, useEffect } from "react";
import { getDocuments, deleteDocument, getDocumentStatistics } from "@/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Search, Trash2, Eye, BarChart3, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Document {
  id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  purpose: string;
  description?: string;
  extraction_method: string;
  is_public: boolean;
  extraction_status: string;
  created_at: string;
}

interface Statistics {
  total_documents: number;
  completed: number;
  failed: number;
  processing: number;
  pending: number;
  average_extraction_time?: number;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [publicOnly, setPublicOnly] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await getDocuments(
        0,
        100,
        statusFilter !== "all" ? statusFilter : undefined,
        publicOnly
      );
      
      if (response.success) {
        setDocuments(response.body?.documents || []);
      } else {
        setError(response.message || "Failed to fetch documents");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getDocumentStatistics();
      if (response.success) {
        setStatistics(response.body);
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchStatistics();
  }, [statusFilter, publicOnly]);

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await deleteDocument(documentId);
      if (response.success) {
        fetchDocuments(); // Refresh the list
        fetchStatistics(); // Refresh statistics
      } else {
        setError(response.message || "Failed to delete document");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      processing: "default",
      completed: "default",
      failed: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredDocuments = documents.filter(doc =>
    doc.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{statistics.total_documents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{statistics.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-2xl font-bold">{statistics.processing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{statistics.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold">{statistics.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage and view uploaded documents</CardDescription>
            </div>
            <Link href="/upload">
              <Button>Upload Document</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{doc.original_filename}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.purpose.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.extraction_status)}
                        {getStatusBadge(doc.extraction_status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.is_public ? "default" : "secondary"}>
                        {doc.is_public ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Document Details</DialogTitle>
                              <DialogDescription>
                                View detailed information about this document
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDocument && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">ID:</span>
                                    <p className="text-gray-600">{selectedDocument.id}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Original Filename:</span>
                                    <p className="text-gray-600">{selectedDocument.original_filename}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Generated Filename:</span>
                                    <p className="text-gray-600">{selectedDocument.filename}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">File Size:</span>
                                    <p className="text-gray-600">{formatFileSize(selectedDocument.file_size)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Purpose:</span>
                                    <p className="text-gray-600">{selectedDocument.purpose.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Extraction Method:</span>
                                    <p className="text-gray-600">{selectedDocument.extraction_method.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Public Access:</span>
                                    <p className="text-gray-600">{selectedDocument.is_public ? "Yes" : "No"}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(selectedDocument.extraction_status)}
                                      {getStatusBadge(selectedDocument.extraction_status)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium">Uploaded At:</span>
                                    <p className="text-gray-600">{formatDate(selectedDocument.created_at)}</p>
                                  </div>
                                </div>
                                {selectedDocument.description && (
                                  <div>
                                    <span className="font-medium">Description:</span>
                                    <p className="text-gray-600 mt-1">{selectedDocument.description}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
