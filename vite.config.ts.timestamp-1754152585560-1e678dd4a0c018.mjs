// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      port: 8080,
      overlay: false,
      clientPort: 8080
    },
    watch: {
      usePolling: false
    }
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
    global: "globalThis"
  },
  plugins: [
    react({
      // Optimisations React SWC pour performance maximale
      plugins: [
        // Configuration pour l'application algérienne
      ]
    }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-tabs",
      "clsx",
      "class-variance-authority",
      "pdfjs-dist"
    ],
    exclude: ["@huggingface/transformers"],
    force: true
  },
  clearScreen: false,
  worker: {
    format: "es"
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    target: "es2020",
    minifyIdentifiers: mode === "production",
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        noEmit: true,
        strict: false,
        noImplicitAny: false,
        strictNullChecks: false
      }
    }
  },
  build: {
    target: "es2020",
    minify: mode === "production" ? "esbuild" : false,
    cssMinify: mode === "production",
    chunkSizeWarningLimit: 500,
    // Avertir à 500KB au lieu de 1MB
    sourcemap: mode === "development",
    emptyOutDir: true,
    // Optimisations de taille et performance
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Inline assets < 4KB
    reportCompressedSize: mode === "production",
    rollupOptions: {
      // Optimisations avancées
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      },
      output: {
        // Laisser Vite optimiser automatiquement les chunks
        format: "es",
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // Optimisations avancées
        compact: mode === "production",
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      },
      // Optimisations externes
      external: (id) => {
        return id.includes("@huggingface/transformers");
      },
      onwarn: (warning, warn) => {
        if (mode === "production" && (warning.code === "CIRCULAR_DEPENDENCY" || warning.code === "THIS_IS_UNDEFINED")) {
          return;
        }
        warn(warning);
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyBDb25maWd1cmF0aW9uIFZpdGUgb3B0aW1pc1x1MDBFOWUgcG91ciBsJ2FwcGxpY2F0aW9uIGFsZ1x1MDBFOXJpZW5uZSBEYWxpbC5kelxuLy8gMTAwJSBsb2NhbGUgZXQgaW5kXHUwMEU5cGVuZGFudGUgLSBQZXJmb3JtYW5jZSBtYXhpbWFsZVxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIGhtcjoge1xuICAgICAgcG9ydDogODA4MCxcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgICAgY2xpZW50UG9ydDogODA4MCxcbiAgICB9LFxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiBmYWxzZSxcbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KG1vZGUpLFxuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICAvLyBPcHRpbWlzYXRpb25zIFJlYWN0IFNXQyBwb3VyIHBlcmZvcm1hbmNlIG1heGltYWxlXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIC8vIENvbmZpZ3VyYXRpb24gcG91ciBsJ2FwcGxpY2F0aW9uIGFsZ1x1MDBFOXJpZW5uZVxuICAgICAgXSxcbiAgICB9KSxcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGNvbXBvbmVudFRhZ2dlcigpLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcicsXG4gICAgICAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zZWxlY3QnLFxuICAgICAgJ0ByYWRpeC11aS9yZWFjdC10b29sdGlwJyxcbiAgICAgICdAcmFkaXgtdWkvcmVhY3QtdGFicycsXG4gICAgICAnY2xzeCcsXG4gICAgICAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5JyxcbiAgICAgICdwZGZqcy1kaXN0J1xuICAgIF0sXG4gICAgZXhjbHVkZTogWydAaHVnZ2luZ2ZhY2UvdHJhbnNmb3JtZXJzJ10sXG4gICAgZm9yY2U6IHRydWVcbiAgfSxcbiAgY2xlYXJTY3JlZW46IGZhbHNlLFxuICB3b3JrZXI6IHtcbiAgICBmb3JtYXQ6ICdlcydcbiAgfSxcbiAgZXNidWlsZDoge1xuICAgIGxvYWRlcjogJ3RzeCcsXG4gICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuW2p0XXN4PyQvLFxuICAgIGV4Y2x1ZGU6IFtdLFxuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gICAgbWluaWZ5SWRlbnRpZmllcnM6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICB0c2NvbmZpZ1Jhdzoge1xuICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgIHNraXBMaWJDaGVjazogdHJ1ZSxcbiAgICAgICAgbm9FbWl0OiB0cnVlLFxuICAgICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgICAgICBub0ltcGxpY2l0QW55OiBmYWxzZSxcbiAgICAgICAgc3RyaWN0TnVsbENoZWNrczogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgIGNzc01pbmlmeTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBBdmVydGlyIFx1MDBFMCA1MDBLQiBhdSBsaWV1IGRlIDFNQlxuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBcbiAgICAvLyBPcHRpbWlzYXRpb25zIGRlIHRhaWxsZSBldCBwZXJmb3JtYW5jZVxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy8gSW5saW5lIGFzc2V0cyA8IDRLQlxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgLy8gT3B0aW1pc2F0aW9ucyBhdmFuY1x1MDBFOWVzXG4gICAgICB0cmVlc2hha2U6IHtcbiAgICAgICAgbW9kdWxlU2lkZUVmZmVjdHM6IGZhbHNlLFxuICAgICAgICBwcm9wZXJ0eVJlYWRTaWRlRWZmZWN0czogZmFsc2UsXG4gICAgICAgIHVua25vd25HbG9iYWxTaWRlRWZmZWN0czogZmFsc2VcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBMYWlzc2VyIFZpdGUgb3B0aW1pc2VyIGF1dG9tYXRpcXVlbWVudCBsZXMgY2h1bmtzXG4gICAgICAgIGZvcm1hdDogJ2VzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJyxcbiAgICAgICAgXG4gICAgICAgIC8vIE9wdGltaXNhdGlvbnMgYXZhbmNcdTAwRTllc1xuICAgICAgICBjb21wYWN0OiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgICAgIGdlbmVyYXRlZENvZGU6IHtcbiAgICAgICAgICBhcnJvd0Z1bmN0aW9uczogdHJ1ZSxcbiAgICAgICAgICBjb25zdEJpbmRpbmdzOiB0cnVlLFxuICAgICAgICAgIG9iamVjdFNob3J0aGFuZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICAvLyBPcHRpbWlzYXRpb25zIGV4dGVybmVzXG4gICAgICBleHRlcm5hbDogKGlkKSA9PiB7XG4gICAgICAgIHJldHVybiBpZC5pbmNsdWRlcygnQGh1Z2dpbmdmYWNlL3RyYW5zZm9ybWVycycpO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgb253YXJuOiAod2FybmluZywgd2FybikgPT4ge1xuICAgICAgICAvLyBTdXBwcmltZXIgbGVzIHdhcm5pbmdzIG5vbiBjcml0aXF1ZXMgZW4gcHJvZHVjdGlvblxuICAgICAgICBpZiAobW9kZSA9PT0gJ3Byb2R1Y3Rpb24nICYmIChcbiAgICAgICAgICB3YXJuaW5nLmNvZGUgPT09ICdDSVJDVUxBUl9ERVBFTkRFTkNZJyB8fFxuICAgICAgICAgIHdhcm5pbmcuY29kZSA9PT0gJ1RISVNfSVNfVU5ERUZJTkVEJ1xuICAgICAgICApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHdhcm4od2FybmluZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFMaEMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsTUFDVCxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTix3QkFBd0IsS0FBSyxVQUFVLElBQUk7QUFBQSxJQUMzQyxRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsTUFFSixTQUFTO0FBQUE7QUFBQSxNQUVUO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxFQUM1QyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLDJCQUEyQjtBQUFBLElBQ3JDLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxhQUFhO0FBQUEsRUFDYixRQUFRO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsU0FBUztBQUFBLElBQ1QsU0FBUyxDQUFDO0FBQUEsSUFDVixRQUFRO0FBQUEsSUFDUixtQkFBbUIsU0FBUztBQUFBLElBQzVCLGFBQWE7QUFBQSxNQUNYLGlCQUFpQjtBQUFBLFFBQ2YsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsZUFBZTtBQUFBLFFBQ2Ysa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUSxTQUFTLGVBQWUsWUFBWTtBQUFBLElBQzVDLFdBQVcsU0FBUztBQUFBLElBQ3BCLHVCQUF1QjtBQUFBO0FBQUEsSUFDdkIsV0FBVyxTQUFTO0FBQUEsSUFDcEIsYUFBYTtBQUFBO0FBQUEsSUFHYixjQUFjO0FBQUEsSUFDZCxtQkFBbUI7QUFBQTtBQUFBLElBQ25CLHNCQUFzQixTQUFTO0FBQUEsSUFFL0IsZUFBZTtBQUFBO0FBQUEsTUFFYixXQUFXO0FBQUEsUUFDVCxtQkFBbUI7QUFBQSxRQUNuQix5QkFBeUI7QUFBQSxRQUN6QiwwQkFBMEI7QUFBQSxNQUM1QjtBQUFBLE1BRUEsUUFBUTtBQUFBO0FBQUEsUUFFTixRQUFRO0FBQUEsUUFDUixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQTtBQUFBLFFBR2hCLFNBQVMsU0FBUztBQUFBLFFBQ2xCLGVBQWU7QUFBQSxVQUNiLGdCQUFnQjtBQUFBLFVBQ2hCLGVBQWU7QUFBQSxVQUNmLGlCQUFpQjtBQUFBLFFBQ25CO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFHQSxVQUFVLENBQUMsT0FBTztBQUNoQixlQUFPLEdBQUcsU0FBUywyQkFBMkI7QUFBQSxNQUNoRDtBQUFBLE1BRUEsUUFBUSxDQUFDLFNBQVMsU0FBUztBQUV6QixZQUFJLFNBQVMsaUJBQ1gsUUFBUSxTQUFTLHlCQUNqQixRQUFRLFNBQVMsc0JBQ2hCO0FBQ0Q7QUFBQSxRQUNGO0FBQ0EsYUFBSyxPQUFPO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
