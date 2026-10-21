# --- compilation ---
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# --- image finale ---
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY sql ./sql
ENV PORT=4000 MEDIA_DIR=/app/media
EXPOSE 4000
# crée/met à jour les tables puis démarre l'API
CMD ["sh", "-c", "node dist/cli/migrate.js && node dist/server.js"]
