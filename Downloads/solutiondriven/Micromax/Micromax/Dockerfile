# Multi-stage build for Micromax Trading Platform

# Stage 1: Build Node.js API
FROM node:18-alpine AS api-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Go Bridge
FROM golang:1.21-alpine AS go-builder
WORKDIR /go-bridge
COPY go-bridge/ .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /go-bridge/main .

# Stage 3: Runtime
FROM node:18-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy Node.js dependencies
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/package*.json ./

# Copy Go bridge binary
COPY --from=go-builder /go-bridge/main ./go-bridge/main

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000 8080 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "api/server.js"]
