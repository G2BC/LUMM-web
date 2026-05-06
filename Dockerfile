# BASE
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

# DEV
FROM base AS dev

ENV HOST=0.0.0.0
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# BUILD
FROM base AS build
ENV NODE_ENV=production

ARG DOTENV_KEY

RUN DOTENV_KEY=${DOTENV_KEY} npm run build

# PROD
FROM nginx:1.29.3-alpine-slim AS prod

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

RUN apk upgrade --no-cache && \
    apk add --no-cache curl=8.14.1-r2

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:80/pt || exit 1

CMD ["nginx", "-g", "daemon off;"]
