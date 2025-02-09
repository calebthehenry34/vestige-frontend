FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
