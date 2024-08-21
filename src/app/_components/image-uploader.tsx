'user client'

import React from "react";
import { UploadButton } from "~/utils/uploadthing";
const ImageUpload = () => {

    return (
    <div>
        <UploadButton endpoint='imageUploader'/>
    </div>
    )
}

export default ImageUpload