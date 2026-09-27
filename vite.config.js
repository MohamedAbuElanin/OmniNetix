import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    minSize: 20000,
                    groups: [
                        { name: 'vendor-react', test: /node_modules[\\/]react/, priority: 30 },
                        { name: 'vendor-recharts', test: /node_modules[\\/]recharts/, priority: 25 },
                        { name: 'vendor-supabase', test: /node_modules[\\/]@supabase/, priority: 25 },
                        { name: 'vendor-icons', test: /node_modules[\\/]lucide-react/, priority: 20 },
                        { name: 'vendor', test: /node_modules/, priority: 10 },
                    ],
                },
            },
        },
    },
});
