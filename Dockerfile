FROM node:12-stretch
WORKDIR /reddit_clone
COPY package-lock.json package.json ./
RUN npm ci
COPY . .

FROM node:18-alpine3.15
USER node
RUN mkdir /home/node/reddit_clone
WORKDIR /home/node/reddit_clone
COPY --from=0 --chown=node:node /reddit_clone .
RUN npm run build
CMD ["npm", "start"]