FROM node:20-alpine AS builder
WORKDIR /app
COPY proxy-server/package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY proxy-server/package.json ./
COPY proxy-server/server.js ./
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
