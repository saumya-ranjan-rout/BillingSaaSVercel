FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist/ ./dist/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the working directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3001

CMD ["node", "dist/server.js"]
