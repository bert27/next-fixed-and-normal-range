import React from "react";
import ErrorDisplay from "./error-display";

interface LayoutProps {
  children: React.ReactNode;
  error: string | null;
}

export default function Layout({ children, error }: LayoutProps) {
  return (
    <div style={{ padding: "20px", background: "white" }}>
      {error ? <ErrorDisplay error={error} /> : children}
    </div>
  );
}