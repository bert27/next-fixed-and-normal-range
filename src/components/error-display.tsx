interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div role="alert" aria-live="assertive" style={{ color: "red" }}>
      <p>{error}</p>
    </div>
  );
}
