import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./global.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Providers from "@/providers/Provider";

// configure Poppins with desired weight & subsets
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Official Inventory Management Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${poppins.variable} font-sans antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Toaster richColors />
            {children}
          </Providers>
        </ThemeProvider>
        <noscript>
          <style>{`html { background: #000; color: #fff; }`}</style>
        </noscript>
      </body>
    </html>
  );
}