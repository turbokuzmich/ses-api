FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 ses-api
RUN chown -R ses-api:nodejs dist

USER ses-api

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3001/healthcheck || exit 1

CMD npm run start:prod