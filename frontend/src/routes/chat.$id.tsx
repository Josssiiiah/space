import { createFileRoute } from '@tanstack/react-router';
import { useChat } from 'ai/react';
import { useEffect, useState, useRef } from 'react';

export const Route = createFileRoute('/chat/$id')({
  component: ChatRoute,
});

function ChatRoute() {
  const { id } = Route.useParams();
  const [title, setTitle] = useState('New Chat');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChat();
  }, [id]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const fetchChat = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/chats/${id}`);
      if (!response.ok) throw new Error('Failed to fetch chat');
      const data = await response.json();
      setTitle(data.title || 'New Chat');
    } catch (error) {
      console.error('Failed to fetch chat:', error);
    }
  };

  const startEditingTitle = () => {
    setEditingTitle(title);
    setIsEditingTitle(true);
  };

  const saveTitle = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/chats/${id}/title`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: editingTitle }),
        },
      );

      if (!response.ok) throw new Error('Failed to update title');
      setTitle(editingTitle);
    } catch (error) {
      console.error('Failed to update chat title:', error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: 'http://localhost:3001/api/chat',
      id,
      body: { id },
      onError: (error) => {
        console.error('Chat Error:', error);
      },
      onResponse: (response) => {
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      },
    });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h1
            onClick={startEditingTitle}
            className="text-xl font-semibold cursor-pointer hover:text-blue-500"
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex-1 overflow-auto space-y-4 p-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded">
            Error: {error.message}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === 'user' ? 'bg-black ml-12' : 'bg-black mr-12'
            }`}
          >
            <div className="font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'AI'}:
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
