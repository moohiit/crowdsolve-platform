import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Determine backend URL
  let backendUrl;
  if (env.VITE_BACKEND_URL) {
    backendUrl = env.VITE_BACKEND_URL;
  } else if (mode === 'production') {
    backendUrl = "https://your-production-backend.com";
  } else {
    backendUrl = "http://localhost:5000";
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: true, // Listen on all addresses
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        }
      },
    },
    // For production build
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    preview: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});