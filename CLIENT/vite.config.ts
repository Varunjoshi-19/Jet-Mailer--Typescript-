import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react() , tailwindcss()],
  resolve : {
     alias : { 
      "@"  : path.resolve(__dirname, "./src"),
     }
  },
  server: {
    allowedHosts: [
      "colt-helping-serval.ngrok-free.app" ,
      "f7c59a4a065a.ngrok-free.app"
    ],
  },
})
