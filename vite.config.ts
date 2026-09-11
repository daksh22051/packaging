import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function backendApiPlugin(): Plugin {
  return {
    name: 'circula-backend-api',
    async configureServer(server) {
      try {
        const { default: app } = await import('./backend/src/app.js');
        const { connectDB } = await import('./backend/src/config/db.js');
        connectDB().catch((err: any) => {
          console.warn('MongoDB connection info:', err?.message);
        });
        server.middlewares.use(app);
      } catch (err) {
        console.warn('Backend API could not be mounted directly:', err);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), backendApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
