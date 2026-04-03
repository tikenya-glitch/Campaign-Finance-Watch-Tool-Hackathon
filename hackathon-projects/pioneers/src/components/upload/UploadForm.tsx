"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface UploadResult {
  success: boolean;
  message: string;
  extraction_summary?: any;
  output_directory?: string;
  tables_extracted?: number;
}

interface FileUploadProps {
  onUploadComplete?: (result: UploadResult) => void;
  className?: string;
}

export default function UploadForm({ onUploadComplete, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Supported file types
  const supportedTypes = {
    'application/pdf': { name: 'PDF', icon: FileText, color: 'text-red-600' },
    'application/vnd.ms-excel': { name: 'Excel', icon: FileText, color: 'text-green-600' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'Excel', icon: FileText, color: 'text-green-600' },
    'text/csv': { name: 'CSV', icon: FileText, color: 'text-blue-600' },
    'application/json': { name: 'JSON', icon: FileText, color: 'text-purple-600' },
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const droppedFile = files[0];
      if (supportedTypes[droppedFile.type as keyof typeof supportedTypes]) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError(`Unsupported file type. Please upload: ${Object.values(supportedTypes).map(t => t.name).join(', ')}`);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (supportedTypes[selectedFile.type as keyof typeof supportedTypes]) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(`Unsupported file type. Please upload: ${Object.values(supportedTypes).map(t => t.name).join(', ')}`);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Determine the appropriate endpoint based on file type
      let endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/file`;
      
      if (file.type === 'application/pdf') {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/enhanced-pdf/extract`;
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/excel/extract`;
      } else if (file.type === 'text/csv') {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/csv/extract`;
      } else if (file.type === 'application/json') {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/json/extract`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: UploadResult = await response.json();

      if (result.success) {
        setUploadResult(result);
        onUploadComplete?.(result);
      } else {
        setError(result.message || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeInfo = (file: File) => {
    return supportedTypes[file.type as keyof typeof supportedTypes] || { name: 'Unknown', icon: FileText, color: 'text-gray-600' };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>

              <div>
                <p className="text-lg font-medium">
                  {file ? file.name : "Drop your file here, or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {file ? formatFileSize(file.size) : `Supported formats: ${Object.values(supportedTypes).map(t => t.name).join(', ')}`}
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/15 border border-destructive/50 text-destructive p-4 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* File Info and Upload Button */}
          {file && !uploadResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const typeInfo = getFileTypeInfo(file);
                    const Icon = typeInfo.icon;
                    return (
                      <>
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{typeInfo.name} • {formatFileSize(file.size)}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <Button variant="ghost" size="sm" onClick={resetUpload}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {(() => {
                      const typeInfo = getFileTypeInfo(file);
                      return typeInfo.name;
                    })()}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && uploadResult.success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Upload Successful!
                  </h3>
                  <p className="text-sm text-green-700 mb-4">{uploadResult.message}</p>

                  {uploadResult.tables_extracted && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-green-800">Tables Extracted: </span>
                      <span className="text-sm text-green-700">{uploadResult.tables_extracted}</span>
                    </div>
                  )}

                  {uploadResult.output_directory && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-green-800">Output Directory: </span>
                      <span className="text-sm text-green-700">{uploadResult.output_directory}</span>
                    </div>
                  )}

                  {uploadResult.extraction_summary && (
                    <div className="mt-4">
                      <h4 className="font-medium text-green-800 mb-2">Extraction Summary:</h4>
                      <pre className="bg-white p-3 rounded border border-green-200 text-xs overflow-auto max-h-40">
                        {JSON.stringify(uploadResult.extraction_summary, null, 2)}
                      </pre>
                    </div>
                  )}

                  <Button onClick={resetUpload} className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Another File
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
