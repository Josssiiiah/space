import { Input } from './ui/input';

export default function Space() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="border border-black p-48">
        <Input placeholder="Type something..." />
      </div>
    </div>
  );
}
