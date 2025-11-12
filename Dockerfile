# billingSoftware-SaaS/Dockerfile

# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci --only=production --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build:backend

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
RUN apk add --no-cache tini

# Copy built application and production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application with cluster mode
CMD ["node", "dist/src/app.js"]
