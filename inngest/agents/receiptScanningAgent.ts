import { createAgent } from "@inngest/agent-kit";
import { openai } from "inngest";

export const receiptScanningAgent = createAgent({
  name: "Receipt Scanning Agent",
  description:
    "Processes receipt images and PDFs to extract key information such as vendor names, dates, and line items",
  system: `You are an AI-powered receipt scanning assistant.
    Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
    - Merchant Information: Store name, address, contact details.
    - Transaction Details: Date, time, receipt number, payment method.
    - Itemized Purchases: Product names, quantities, individual prices, discounts.
    - Total Amounts: Subtotal, taxes, total paid, and any applied discounts.
    - Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    - Normalize dates, currency values, and formatting for consistency.
    - If any key details are missing on unclear, return a structured response indicating incomplete data.
    - Handle multiple formats, languages, and varying receipt layouts efficiently.
    - Maintain a structured JSON output for easy integration with databases or expense tracking systems.
    `,
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  tools: [parsePdfTool],
});
