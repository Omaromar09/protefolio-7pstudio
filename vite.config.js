import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Lightweight local API middleware for development
function localApiPlugin() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/contact') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Inquiry registered successfully (Local Dev)',
                lead: {
                  ...data,
                  id: 'lead_' + Date.now(),
                  created_at: new Date().toISOString(),
                  status: 'new'
                }
              }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        if (req.url.startsWith('/api/track') && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ tracked: true }));
          return;
        }

        if (req.url.startsWith('/api/vercel-status')) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({
            connected: false,
            environment: 'production',
            domain: '7pstudio.tech',
            status: 'READY',
            lastDeployment: {
              id: 'dpl_7p_dev',
              url: 'https://7pstudio.tech',
              state: 'READY',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              creator: '7P Studio',
              target: 'production',
              meta: {
                githubCommitMessage: 'Performance, i18n & 3D WebGL polish',
                githubCommitRef: 'main'
              }
            },
            uptime: '99.98%',
            activeDeploymentsCount: 1,
            framework: 'vite',
            region: 'iad1 (US East)'
          }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [localApiPlugin()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }
        }
      }
    }
  }
});
