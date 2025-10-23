# BASE
FROM node:20 AS base

RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

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

ARG VITE_API_URL
ARG VITE_API_KEY
ARG VITE_ROBOTS
ARG VITE_SITE_URL

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_KEY=${VITE_API_KEY}
ENV VITE_ROBOTS=${VITE_ROBOTS}
ENV VITE_SITE_URL=${VITE_SITE_URL}

RUN npm run build

# PROD
FROM nginx:1.27-alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsSL http://127.0.0.1/robots.txt > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]