import GhostContentAPI from '@tryghost/content-api';

export const ghostClient = new GhostContentAPI({
  url: import.meta.env.VITE_GHOST_API_URL || 'https://demo.ghost.io',
  key: import.meta.env.VITE_GHOST_CONTENT_API_KEY || '22444f78447824223cefc48062',
  version: 'v5.0'
});
