FROM node:22-bookworm
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npm run migrate && exec node dist/server.js"]
