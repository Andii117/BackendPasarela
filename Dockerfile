# ETAPA 1: BUILD
FROM node:20 AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copiar código y construir
COPY . .
RUN npx prisma generate
RUN npm run build

# ETAPA 2: RUN
FROM node:20

WORKDIR /app

# Copiamos las dependencias y la carpeta construida
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]