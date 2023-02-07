FROM balena/open-balena-base:no-systemd-v14.0.0 AS build

WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run build && npm run test:in-container

# ---- Final image ----
FROM balena/open-balena-base:no-systemd-v14.0.0

ENV NODE_ENV=prod
WORKDIR /usr/src/app

COPY package* ./
RUN npm ci --production

COPY --from=build /usr/src/app/build/src ./src
COPY docker-hc docker-hc

EXPOSE 80
EXPOSE 9090
CMD ["node", "src/app"]
