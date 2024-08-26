"use server";

import { utapi } from "~/server/uploadthing";

export const removeImageFromS3 = async (imageKey: string) => {
    try {
        await utapi.deleteFiles(imageKey);
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete image with key ${imageKey}:`, error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
};