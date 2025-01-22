import { createFileRoute } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/space')({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="border border-black p-48">
        <Input placeholder="Type something..." />
      </div>
    </div>
  );
}
