import type { Metadata } from "next";
import { Toaster } from "sonner";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { PackageNameProvider } from "@/components/providers/package-name";
import "./globals.css";

export const metadata: Metadata = {
    title: "Artode Icons",
    description: "Artode Icons Project",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground font-sans`}>
                <PackageNameProvider>
                    {children}
                </PackageNameProvider>
                <Toaster />
            </body>
        </html>
    );
}
