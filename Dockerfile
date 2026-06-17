FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV DATABASE_URL="file:/data/dev.db"

EXPOSE 3000

CMD ["sh", "-c", "if [ ! -f /data/dev.db ]; then cp /app/dev.db /data/dev.db; fi && npx prisma migrate deploy 2>/dev/null; npm start"]
