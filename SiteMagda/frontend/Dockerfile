FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/ssl.conf.template /etc/nginx/conf-templates/ssl.conf.template
COPY nginx/local.conf.template /etc/nginx/conf-templates/local.conf.template
COPY nginx-entrypoint.sh /docker-entrypoint.d/99-render-config.sh
RUN chmod +x /docker-entrypoint.d/99-render-config.sh
# Remove the base image's default site (would otherwise sit alongside ours)
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80 443
