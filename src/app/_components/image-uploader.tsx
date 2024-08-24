"use client";

import Image from "next/image";
import { UploadDropzone } from "@uploadthing/react";
import React, { useState } from "react";

type ImageUploadProps = {
  onUploadSuccess: (imageUrl: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const url = res[0].url;
          setImageUrl(url);
          onUploadSuccess(url); // Call the parent's callback
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />

      {imageUrl.length ? (
        <div>
          <Image src={imageUrl} alt="Uploaded image" width={500} height={300} />
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;