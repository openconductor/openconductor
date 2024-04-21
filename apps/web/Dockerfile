# Stage 1: Building the code
FROM node:16-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of your application code
COPY . .

# Build the project
RUN pnpm run build

# Stage 2: Running the application
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["pnpm", "start"]