import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
