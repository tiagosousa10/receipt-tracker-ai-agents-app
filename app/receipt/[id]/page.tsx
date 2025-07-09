"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const Receipt = () => {
  const params = useParams<{ id: string }>();
  const [receiptId, setReceiptId] = useState<Id<"receipts"> | null>(null);
  const router = useRouter();

  const { userId } = useAuth();

  //fetch the receipt details -> OLD VERSION
  // const receipt = useQuery(
  //   api.receipts.getReceiptById,
  //   receiptId ? { id: receiptId } : "skip",
  // );

  //new version to fetch receipts
  const receipt = useQuery(api.receipts.getReceiptById, {
    id: receiptId ?? "", // provide a default value if receiptId is null
    userId: userId!, // passa manualmente
  });

  //get the download URL (for the view button)
  const fileId = receipt?.fileId;
  const downloadUrl = useQuery(
    api.receipts.getReceiptDownloadUrl,
    fileId ? { fieldId: fileId } : "skip",
  );

  useEffect(() => {
    try {
      const id = params.id as Id<"receipts">;
      setReceiptId(id);
    } catch (error) {
      console.error("Invalid receipt id: ", error);
      router.push("/");
    }
  }, [params.id, router]);

  //Loading state
  if (receipt === undefined) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  //Receipt not found
  if (receipt === null) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="mb-6">
            The receipt you&apos;re looking for doesn&apos;t exist or has been
            removed
          </p>
          <Link
            href={"/"}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  //format upload date
  const uploadDate = new Date(receipt.uploadedAt).toLocaleString();

  //check if receipt has extracted data
  const hasExtractedData = !!(
    receipt.merchantName ||
    receipt.merchantAddress ||
    receipt.transactionDate ||
    receipt.transactionAmount
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <nav>
          <Link
            href={"/receipts"}
            className="text-blue-500 hover:underline flex items-center"
          >
            <ChevronLeft className="size-4 mr-1" />
            Back to Receipts
          </Link>
        </nav>
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center justify-baseline mb-6">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {receipt.fileDisplayName || receipt.fileName}
              </h1>
              <div className="flex items-center ">
                {receipt.status === "pending" ? (
                  <div className="mr-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                  </div>
                ) : null}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-800" : receipt.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {receipt.status.charAt(0).toUpperCase() +
                    receipt.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    File Information
                  </h3>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Uploaded</p>
                        <p className="font-medium">{uploadDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-medium">
                          {formatFileSize(receipt.size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium">{receipt.mimeType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-medium truncate" title={receipt._id}>
                          {receipt._id.slice(0, 10)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
