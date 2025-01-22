import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/about')({
  component: AboutComponent,
});

function AboutComponent() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-2">
      <h3>About</h3>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
}
