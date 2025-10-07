FROM node:22-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set registry 'https://registry.npmmirror.com/'
RUN yarn config set network-timeout 300000
RUN yarn install --frozen-lockfile --network-timeout 300000

FROM base AS builder

RUN apk update && apk add --no-cache git

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM base AS runner
WORKDIR /app



COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

RUN mkdir -p /app/app/mcp && chmod 777 /app/app/mcp

EXPOSE 3000

CMD ["node", "server.js"]
