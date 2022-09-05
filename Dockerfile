FROM node:10 as builder-control
ENV NODE_ENV=production
RUN mkdir -p /control
WORKDIR /control
ADD orkestra-control/package.json /control/
ADD orkestra-control/package-lock.json /control/
RUN npm install
ADD orkestra-control/. /control

FROM node:10 as builder-app
ENV NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
ADD orkestraApp/package.json /app/
ADD orkestraApp/package-lock.json /app/
RUN npm install
ADD orkestraApp/. /app

FROM node:10 as builder-backend
RUN mkdir -p /server
WORKDIR /server
ADD package.json /server/
ADD package-lock.json /server/
RUN npm install
ADD . /server

FROM node:10
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder-backend /server .
COPY --from=builder-control /control /app/orkestra-control
COPY --from=builder-app /app /app/orkestraApp
RUN npm run build
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
CMD ["npm","start"]