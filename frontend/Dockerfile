# Build stage
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM node:18

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist

EXPOSE 5173
CMD [ "serve", "-s", "dist", "-l", "5173" ]