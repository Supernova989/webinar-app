FROM node:lts-alpine
RUN mkdir -p /webinar_app
WORKDIR /webinar_app
RUN npm install pm2 -g
RUN npm install yarn -g
COPY package.json .
RUN yarn install
RUN mkdir -p /webinar_app/frontend
COPY frontend/package.json /webinar_app/frontend
WORKDIR /webinar_app/frontend
RUN yarn install
WORKDIR /webinar_app
COPY . .
WORKDIR /webinar_app/frontend
RUN yarn run build
WORKDIR /webinar_app
EXPOSE 3030
CMD ["npm", "run", "start"]

