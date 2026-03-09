import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { Upload, FileImage } from "lucide-react";
import Link from "next/link";

const imageFiles = [
  "0fb441fc-b839-4a43-8a53-77d8a1e6d0dd.png",
  "3557bb64-e243-47b0-8572-a5977c764a9b.png", 
  "dacd7a11-b33c-4f10-916b-7d3f2840af10.png",
  "e8b3fbb4-30ec-44d4-a9db-da099ad5d883.png"
];

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Political Finance Documents</h1>
              <p className="text-gray-600">Browse through our collection of political finance visualizations and data</p>
            </div>
            <Link href="/upload">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Upload Section */}
        <div className="mb-12">
          <DocumentUpload />
        </div>
        
        {/* Existing Images Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <FileImage className="h-5 w-5" />
            <h2 className="text-2xl font-semibold text-gray-900">Existing Images</h2>
          </div>
          
          {imageFiles.map((filename, index) => (
            <div key={index} className="w-full bg-white">
              <div className="relative w-full h-screen max-h-screen bg-white">
                <Image
                  src={`/images/${filename}`}
                  alt={`Political finance image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="text-center py-4 bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filename}
                </h3>
                <p className="text-sm text-gray-500">
                  Image {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}