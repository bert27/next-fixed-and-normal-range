// src/app/layout.tsx
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";
import { Metadata } from "next";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Range Sliders – Fixed & Normal Modes",
  description:
    "Explore a powerful range slider demo with fixed and customizable modes, built using Next.js and styled for modern web applications.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}

RootLayout.Content = function RootLayoutContent({ children }: RootLayoutProps) {
  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
};
