import { UploadButton } from "~/utils/uploadthing";
export default function UploadS3Example() {
  return (
    <UploadButton
      className="w-full ut-button:w-full ut-button:bg-secondary ut-button:ut-readying:bg-secondary"
      endpoint="imageUploader"
      content={{
        button({ ready }) {
          if (ready) return <div>Upload image</div>;

          return "loading...";
        },
        allowedContent({ ready, fileTypes, isUploading }) {
          // if (!ready) return "Checking what you allow";
          if (isUploading) return "uploading the profile picture";
          return "";
          // return `Stuff you can upload: ${fileTypes.join(", ")}`;
        },
      }}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
