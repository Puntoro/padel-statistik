import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/padel-statistik/",
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // exposes the dev server on your LAN — handy for testing on your phone
  },
});
