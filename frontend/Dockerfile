# for development: docker build --target dev -t react-docker:1.0.0-dev .
# command to run: docker run --rm -it --name web -p 3000:3000 -v $(pwd):/code react-docker:1.0.0-dev
FROM node:22.11.0 as dev

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["npm", "run", "start"]


# for production: docker build --target prod -t react-docker:1.0.0-prod .
# command to run: docker run --rm -it --name web -p 3000:80 react-docker:1.0.0-prod
# this image is way smaller than the dev image
FROM node:22.11.0 as build

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY . .

RUN npm run build

#NGINX Web Server
FROM nginx:1.27.2 as prod

COPY --from=build /code/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




