import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//function to generate a convex upload url for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    //generate a convex upload url that client can use to upload a file
    return await ctx.storage.generateUploadUrl();
  },
});

//function to store the receipt
export const storeReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    //save the receipt to the database
    const receiptId = await ctx.db.insert("receipts", {
      userId: args.userId,
      fileName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",

      //initialize extracted data fields as null
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      items: [],
    });

    return receiptId;
  },
});
