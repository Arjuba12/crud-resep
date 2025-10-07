import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // supaya bisa diakses dari network/public URL
    port: 5173, // sesuai port dev server kamu
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "unpresiding-encephalic-dawn.ngrok-free.dev", // tambahkan host ngrok-mu
    ],
  },
});
