// src/pages/_app.tsx
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#333",
            fontWeight: "bold",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
        }}
        containerStyle={{
          top: "4.5rem", // 👈 push it down from the very top (~72px)
          right: "1rem",
        }}
      />
    </>
  );
}
