# Etapa 1: Build
FROM node:20-alpine AS builder

# Instalamos las dependencias necesarias para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
# Generamos el cliente para Linux
RUN npx prisma generate

COPY . .
RUN npm run build

# Etapa 2: Run
FROM node:20-alpine

# IMPORTANTE: También necesitamos openssl en la imagen de ejecución
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# El comando que automatiza todo
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/main"]