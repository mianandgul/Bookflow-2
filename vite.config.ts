import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ mode }) => {
  return {
    mode: 'production',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      modulePreload: {
        resolveDependencies: (url, deps) => {
          // Only preload dependencies critical to the initial landing view.
          // Filter out heavy admin/dashboard/auth/supabase chunks so mobile landing LCP/FCP stays lean.
          return deps.filter((dep) => {
            return !dep.includes('supabase') &&
                   !dep.includes('Dashboard') &&
                   !dep.includes('AuthModal') &&
                   !dep.includes('Overview') &&
                   !dep.includes('Bookings') &&
                   !dep.includes('Services') &&
                   !dep.includes('Availability') &&
                   !dep.includes('Customers') &&
                   !dep.includes('Settings') &&
                   !dep.includes('BusinessProfile') &&
                   !dep.includes('CustomerBooking');
          });
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/@supabase/')) {
              return 'supabase-vendor';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
