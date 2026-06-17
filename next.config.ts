import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Genera .next/standalone con un server.js mínimo y solo las dependencias
  // necesarias. Es lo que despliega el pipeline a Azure App Service.
  output: "standalone",
};

export default nextConfig;
