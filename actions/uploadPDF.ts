"use server";

import { currentUser } from "@clerk/nextjs/server";

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
  } catch (error) {
    console.error("Server action upload PDF failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
