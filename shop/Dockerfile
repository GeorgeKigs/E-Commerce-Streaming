FROM node:alpine
COPY package*.json ./
RUN npm install
# WORKDIR /usr/src/app
COPY . .
RUN ls
EXPOSE 5001
# CMD [ "npm","run","dev" ] 