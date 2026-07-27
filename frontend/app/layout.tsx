import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoaderProvider } from "@/components/site/loader-provider";
import { CustomerAuthProvider } from "@/components/providers/customer-auth-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NovaCommerce",
  description: "Modern ecommerce management for NovaCommerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LoaderProvider>
          <CustomerAuthProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </CustomerAuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
