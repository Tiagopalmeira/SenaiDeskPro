import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Avatar Frontend",
    description: "Avatar management application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AuthProvider>
                    <ThemeProvider>
                        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
