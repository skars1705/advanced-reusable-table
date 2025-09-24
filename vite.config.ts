import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    const isLib = mode === 'lib';
    
    if (isLib) {
      return {
        plugins: [
          dts({
            insertTypesEntry: true,
            include: ['src/**/*'],
            exclude: ['src/data/**/*', 'src/**/*.test.*'],
          })
        ],
        build: {
          lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'AdvancedReusableTable',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
              // Ensure CSS is emitted as a separate file
              assetFileNames: (assetInfo) => {
                if (assetInfo.name?.endsWith('.css')) {
                  return 'style.css';
                }
                return assetInfo.name || 'assets/[name].[ext]';
              },
            },
          },
          sourcemap: true,
          minify: false,
          // Enable CSS processing and ensure it's extracted
          cssCodeSplit: false,
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'src'),
          }
        }
      };
    }
    
    // Development/demo mode
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
