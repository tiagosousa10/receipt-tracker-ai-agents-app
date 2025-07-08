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
      </div>
    </div>
  );
};

export default Receipt;
