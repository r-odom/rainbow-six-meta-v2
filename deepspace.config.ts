import { defineConfig } from 'deepspace/worker';

export default defineConfig({
  appName: 'rainbow-six-meta',
  domain: 'rainbow-six-meta.app.space',
  auth: {
    providers: ['google', 'github']
  }
});
