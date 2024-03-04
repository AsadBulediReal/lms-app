"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string, name?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url, res?.[0].name);
      }}
      onUploadError={(error: Error) => {
        if (error.message === "Unable to get presigned urls") {
          toast.error("File size exceeds the limit.");
        } else {
          toast.error(`${error?.message}`);
        }
      }}
    />
  );
};

export default FileUpload;
