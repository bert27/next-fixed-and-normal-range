"use client";

import React from "react";

interface LayoutProps {
  title: string;
  subtitle: string;
  isLoading: boolean;
  errorMessage: string | null;
  children: React.ReactNode;
}

export default function Layout({
  title,
  subtitle,
  isLoading,
  errorMessage,
  children,
}: LayoutProps) {
  if (isLoading) {
    return (
      <div role="alert" aria-live="polite">
        <p>Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div role="alert" aria-live="assertive">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div style={{ padding: "20px", background: "white" }}>{children}</div>
    </div>
  );
}