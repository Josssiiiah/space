import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';

type Chat = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
};

export const Route = createFileRoute('/')({
  component: IndexRoute,
});

function IndexRoute() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (editingId && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingId]);

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chats', {
        method: 'POST',
      });
      const data = await response.json();
      navigate({ to: '/chat/$id', params: { id: data.id } });
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveTitle = async (chatId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/chats/${chatId}/title`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: editingTitle }),
        },
      );

      if (!response.ok) throw new Error('Failed to update title');

      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, title: editingTitle } : chat,
        ),
      );
    } catch (error) {
      console.error('Failed to update chat title:', error);
    } finally {
      setEditingId(null);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/chats/${chatId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) throw new Error('Failed to delete chat');

      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Chats</h1>
        <button
          onClick={createNewChat}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Chat
        </button>
      </div>

      {chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <p className="text-gray-500 mb-4">
            No chats yet. Start a new conversation!
          </p>
          <button
            onClick={createNewChat}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
          >
            Start New Chat
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 border rounded-lg hover:border-blue-500 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                {editingId === chat.id ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => saveTitle(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTitle(chat.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div
                    onClick={() => startEditing(chat)}
                    className="font-medium cursor-pointer hover:text-blue-500"
                  >
                    {chat.title}
                  </div>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      navigate({ to: '/chat/$id', params: { id: chat.id } })
                    }
                    className="p-1 text-gray-600 hover:text-blue-500"
                  >
                    Open
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-1 text-gray-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="font-medium mb-2 truncate text-gray-600">
                {chat.preview}
              </div>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                <span>{chat.messageCount} messages</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
