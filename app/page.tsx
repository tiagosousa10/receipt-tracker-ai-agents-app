import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent Receipt Scanning
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Scan, analyze, and organize your receipts with AI-powered
                precision. Save time and gain insights from your expenses.
              </p>
            </div>

            <div className="space-x-4">
              <Link href={"/receipts"}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* FEATURES */}
      {/* PRICING */}
      {/* INFO */}
      {/* FOOTER */}
    </div>
  );
}
