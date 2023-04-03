FROM nginx:stable-alpine-slim
COPY ./dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/
RUN chmod -R 755 /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80