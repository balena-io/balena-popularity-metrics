FROM balena/open-balena-base:no-systemd-v14.0.0 AS build

WORKDIR /usr/src/app

COPY package* ./
RUN npm ci

COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN npm run build

# ---- Final image ----
FROM balena/open-balena-base:no-systemd-v14.0.0

ENV NODE_ENV=prod
WORKDIR /usr/src/app

COPY package* ./
RUN npm ci --production

COPY --from=build /usr/src/app/build/src ./src
COPY docker-hc docker-hc

EXPOSE 3001
EXPOSE 3002
CMD ["node", "src/app"]
