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

export const getReceipts = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    //only return receipts for the authenticated user
    return await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

export const getReceiptById = query({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    //get the receipt
    const receipt = await ctx.db.get(args.id);

    //verify user has access to this receipt
    if (receipt) {
      const identify = await ctx.auth.getUserIdentity();
      if (!identify) {
        throw new Error("Unauthorized");
      }

      const userId = identify.subject;
      if (receipt.userId !== userId) {
        throw new Error("Unauthorized access to receipt");
      }
    }

    return receipt;
  },
});

// generate a receipt download url
export const getReceiptDownloadUrl = query({
  args: {
    fieldId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fieldId);
  },
});

//update the status for the receipt
export const updateReceiptStatus = mutation({
  args: {
    id: v.id("receipts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // verify user has access to this receipt
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new Error("Unauthorized");
    }

    const userId = identify.subject;
    if (receipt.userId !== userId) {
      throw new Error("Unauthorized access to receipt");
    }

    // update the status
    await ctx.db.patch(args.id, { status: args.status });
    return true;
  },
});

//delete a receipt
export const deleteReceipt = mutation({
  args: {
    id: v.id("receipts"),
  },
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.id);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new Error("Unauthorized");
    }

    const userId = identify.subject;
    if (receipt.userId !== userId) {
      throw new Error("Unauthorized access to receipt");
    }

    await ctx.db.delete(args.id);

    return true;
  },
});
