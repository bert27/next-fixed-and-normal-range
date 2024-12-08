// src/app/layout.tsx
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

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
