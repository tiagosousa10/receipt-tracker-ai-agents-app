"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

export async function getFileDownloadUrl(id: Id<"_storage"> | string) {
  try {
    // get download url from convex
    const downloadUrl = await convex.query(api.receipts.getReceiptDownloadUrl, {
      fieldId: fileId as Id<"_storage">,
    });

    if (!downloadUrl) {
      return {
        success: false,
        error: "File not found",
      };
    }

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error getting file download url", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error getting file download url",
    };
  }
}
