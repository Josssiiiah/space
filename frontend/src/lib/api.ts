import { edenTreaty } from '@elysiajs/eden';
import type { App } from '../../../backend/src';

export const api = edenTreaty<App>('http://localhost:3001', {
  fetcher: (url, init) => {
    return fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  },
});
