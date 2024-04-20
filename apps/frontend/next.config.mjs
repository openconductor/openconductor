// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

//@ts-ignore
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'


/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@openconductor/api",
    "@openconductor/auth",
    "@openconductor/db",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  images: {
    domains: [
      "localhost:3000",
      "lh3.googleusercontent.com",
      "ui-avatars.com",
      "avatars.githubusercontent.com"
    ],
  },
};

export default config;

