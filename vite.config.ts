import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  worker: {
    format: 'es'
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React and React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          
          // PDF processing
          if (id.includes('node_modules/pdfjs-dist')) {
            return 'pdf-vendor';
          }
          
          // Google AI and Langchain
          if (id.includes('node_modules/@google/generative-ai') || 
              id.includes('node_modules/@langchain') ||
              id.includes('node_modules/langchain')) {
            return 'ai-vendor';
          }
          
          // State management and utilities
          if (id.includes('node_modules/zustand') || 
              id.includes('node_modules/zod') ||
              id.includes('node_modules/date-fns') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'utils-vendor';
          }
          
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
