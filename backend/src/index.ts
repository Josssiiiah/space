import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { db } from './db/connection';
import { users, chats } from './db/schema';
import { eq } from 'drizzle-orm';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { CoreMessage } from 'ai';
import { generateId } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// OpenRouter
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
const claude = openrouter.chat('anthropic/claude-3.5-sonnet');

// OpenAI
const gpt4oMini = openai('gpt-4o-mini');

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .post('/api/chat', async ({ body }) => {
    try {
      console.log('Received chat request with body:', body);

      const { messages, id } = body as {
        messages: Array<{ role: string; content: string }>;
        id?: string;
      };

      console.log('Processing messages:', messages);

      // Create a new chat if no ID provided
      const chatId = id || generateId();

      const result = streamText({
        model: claude,
        system: 'You are a helpful AI assistant.',
        messages: messages as CoreMessage[],
        async onFinish({ response }) {
          const allMessages = [...messages, ...response.messages];
          // Save or update chat
          if (id) {
            await db
              .update(chats)
              .set({
                messages: JSON.stringify(allMessages),
                updatedAt: new Date().toISOString(),
              })
              .where(eq(chats.id, id));
          } else {
            await db.insert(chats).values({
              id: chatId,
              title: 'New Chat',
              messages: JSON.stringify(allMessages),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        },
      });

      console.log('Stream created successfully');

      return result.toDataStreamResponse();
    } catch (error) {
      console.error('Chat endpoint error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to process chat request',
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  })
  .get('/api/chats/:id', async ({ params: { id } }) => {
    const chat = await db.select().from(chats).where(eq(chats.id, id));
    if (!chat[0]) {
      return new Response(JSON.stringify({ error: 'Chat not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return {
      id: chat[0].id,
      title: chat[0].title,
      messages: JSON.parse(chat[0].messages),
    };
  })
  .post('/api/chats', async () => {
    const id = generateId();
    const newChat = await db
      .insert(chats)
      .values({
        id,
        title: 'New Chat',
        messages: '[]',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    return newChat[0];
  })
  .patch('/api/chats/:id/title', async ({ params: { id }, body }) => {
    try {
      const { title } = body as { title: string };
      if (!title) {
        return new Response(JSON.stringify({ error: 'Title is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const updatedChat = await db
        .update(chats)
        .set({
          title,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(chats.id, id))
        .returning();

      if (!updatedChat[0]) {
        return new Response(JSON.stringify({ error: 'Chat not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return updatedChat[0];
    } catch (error) {
      console.error('Title update error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to update chat title',
          details: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  })
  .delete('/api/chats/:id', async ({ params: { id } }) => {
    try {
      const deletedChat = await db
        .delete(chats)
        .where(eq(chats.id, id))
        .returning();

      if (!deletedChat[0]) {
        return new Response(JSON.stringify({ error: 'Chat not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return deletedChat[0];
    } catch (error) {
      console.error('Delete chat error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to delete chat',
          details: error instanceof Error ? error.message : String(error),
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  })
  .get('/api/chats', async () => {
    const allChats = await db.select().from(chats).orderBy(chats.updatedAt);
    return allChats.map((chat) => {
      const messages = JSON.parse(chat.messages);
      const lastMessage = messages[messages.length - 1];
      let preview = 'New Chat';
      if (lastMessage?.content) {
        preview =
          typeof lastMessage.content === 'string'
            ? lastMessage.content
            : lastMessage.content.text || 'New Chat';
      }
      return {
        id: chat.id,
        title: chat.title,
        preview: preview.slice(0, 100),
        updatedAt: chat.updatedAt,
        messageCount: messages.length,
      };
    });
  })
  .listen(process.env.BACKEND_PORT || 3001);

console.log(
  `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`,
);

// Export type for Eden Treaty
export type App = typeof app;
