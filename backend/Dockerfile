FROM node:20-alpine AS builder

WORKDIR /app


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./


COPY backend/package.json ./backend/


RUN npm install -g pnpm


RUN pnpm install --frozen-lockfile --filter backend

COPY backend/ ./backend/

WORKDIR /app/backend
RUN pnpm build


FROM node:20-alpine

WORKDIR /app


RUN npm install -g pnpm


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./


COPY backend/package.json ./backend/


RUN pnpm install --prod --frozen-lockfile --filter backend

COPY --from=builder /app/backend/dist ./backend/dist


ENV NODE_PATH=/app/node_modules


WORKDIR /app/backend

EXPOSE 3000


CMD ["node", "dist/main.js"]

