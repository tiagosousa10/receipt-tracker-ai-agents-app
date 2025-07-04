"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";

export async function uploadPDF(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  try {
    // get the file from the form data
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    //validate the file type
    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return {
        success: false,
        error: "File must be a PDF",
      };
    }

    // get the upload url from convex
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    // convert file to arrayBuffer for the fetch API
    const arrayBuffer = await file.arrayBuffer();

    // upload the file to convex store
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    // get storage ID from the response
    const { storageId } = await uploadResponse.json();

    // add receipt to the database
    const receiptId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    //generate the file url
    const fileUrl = await getFileDownloadUrl(storageId);

    //TOD: trigger innges agent flow...

    return {
      success: true,
      data: {
        receiptId,
        fileName: file.name,
      },
    };
  } catch (error) {
    console.error("Server action upload PDF failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
