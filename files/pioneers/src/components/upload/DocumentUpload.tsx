"use client";

import { useState } from "react";
import { uploadDocument } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface UploadResponse {
  success: boolean;
  message: string;
  document: {
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
  };
  extraction_task_id?: string;
}

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [purpose, setPurpose] = useState<string>("other");
  const [description, setDescription] = useState<string>("");
  const [extractionMethod, setExtractionMethod] = useState<string>("auto");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
      setUploadResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadDocument(
        file,
        purpose,
        description || undefined,
        extractionMethod,
        isPublic
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        const responseData = response.body as UploadResponse;
        setUploadResult(responseData);
        // Reset form
        setFile(null);
        setDescription("");
        setPurpose("other");
        setExtractionMethod("auto");
        setIsPublic(false);
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setError(response.message || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Upload a PDF document for processing in the political finance system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">PDF File *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="flex-1"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Select value={purpose} onValueChange={setPurpose} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_reports">Financial Reports</SelectItem>
                  <SelectItem value="county_data">County Data</SelectItem>
                  <SelectItem value="candidate_data">Candidate Data</SelectItem>
                  <SelectItem value="party_data">Party Data</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the document"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={3}
              />
            </div>

            {/* Extraction Method */}
            <div className="space-y-2">
              <Label htmlFor="extraction-method">Extraction Method</Label>
              <Select value={extractionMethod} onValueChange={setExtractionMethod} disabled={isUploading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select extraction method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automatic</SelectItem>
                  <SelectItem value="tables_only">Tables Only</SelectItem>
                  <SelectItem value="text_only">Text Only</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Public Access */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isUploading}
              />
              <Label htmlFor="is-public">Make document publicly accessible</Label>
            </div>

            {/* Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success */}
            {uploadResult && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Document uploaded successfully! ID: {uploadResult.document.id}
                  {uploadResult.extraction_task_id && ` | Task ID: ${uploadResult.extraction_task_id}`}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isUploading || !file} className="w-full">
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Upload Result Details */}
      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Document ID:</span>
                <p className="text-gray-600">{uploadResult.document.id}</p>
              </div>
              <div>
                <span className="font-medium">Filename:</span>
                <p className="text-gray-600">{uploadResult.document.original_filename}</p>
              </div>
              <div>
                <span className="font-medium">Generated Filename:</span>
                <p className="text-gray-600">{uploadResult.document.filename}</p>
              </div>
              <div>
                <span className="font-medium">File Size:</span>
                <p className="text-gray-600">{(uploadResult.document.file_size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <span className="font-medium">Purpose:</span>
                <p className="text-gray-600">{uploadResult.document.purpose}</p>
              </div>
              <div>
                <span className="font-medium">Extraction Method:</span>
                <p className="text-gray-600">{uploadResult.document.extraction_method}</p>
              </div>
              <div>
                <span className="font-medium">Public Access:</span>
                <p className="text-gray-600">{uploadResult.document.is_public ? "Yes" : "No"}</p>
              </div>
              <div>
                <span className="font-medium">Extraction Status:</span>
                <p className="text-gray-600">{uploadResult.document.extraction_status}</p>
              </div>
              <div>
                <span className="font-medium">Uploaded At:</span>
                <p className="text-gray-600">{new Date(uploadResult.document.created_at).toLocaleString()}</p>
              </div>
              {uploadResult.extraction_task_id && (
                <div>
                  <span className="font-medium">Extraction Task ID:</span>
                  <p className="text-gray-600">{uploadResult.extraction_task_id}</p>
                </div>
              )}
              {uploadResult.document.description && (
                <div className="col-span-2">
                  <span className="font-medium">Description:</span>
                  <p className="text-gray-600">{uploadResult.document.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
