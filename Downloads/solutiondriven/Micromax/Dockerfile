# Multi-stage build for Micromax Trading Platform

# Stage 1: Build Node.js API
FROM node:18-alpine AS api-builder
WORKDIR /app
COPY Micromax/package*.json ./
RUN npm ci --only=production 2>/dev/null || true

# Stage 2: Go Bridge
FROM golang:1.21-alpine AS go-builder
WORKDIR /go-bridge
COPY Micromax/go-bridge/ .
RUN go mod download 2>/dev/null || true
RUN CGO_ENABLED=0 GOOS=linux go build -o /go-bridge/main . 2>/dev/null || echo "Go build skipped"

# Stage 3: Runtime
FROM node:18-alpine
WORKDIR /app

# Install curl for health checks and ca-certificates
RUN apk add --no-cache curl ca-certificates

# Copy Node.js dependencies (if they exist)
COPY Micromax/node_modules ./node_modules 2>/dev/null || true
COPY Micromax/package*.json ./ 2>/dev/null || true

# Copy Go bridge binary (if built)
COPY --from=go-builder /go-bridge/main ./go-bridge/ 2>/dev/null || true

# Copy application code
COPY Micromax/ .

# Expose ports
EXPOSE 3000 8080 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "api/server.js"]
