ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8081"]
