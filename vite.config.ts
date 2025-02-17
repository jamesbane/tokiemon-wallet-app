import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyPlugin from '@netlify/vite-plugin-react-router'

export default defineConfig({
  server: {
    host: '0.0.0.0',  // Allows connections from all networks
    port: 5173,       // Change if needed
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), netlifyPlugin()],
  ssr: {
    noExternal: ['@mui/icons-material'],
  },
});
