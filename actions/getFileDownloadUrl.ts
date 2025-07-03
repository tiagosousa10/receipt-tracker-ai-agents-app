"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { Id } from "@/convex/_generated/dataModel";

export async function getFileDownloadUrl(id: Id<"_storage"> | string) {}
