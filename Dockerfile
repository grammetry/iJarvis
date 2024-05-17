FROM nginx
COPY build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx

CMD ["nginx", "-g", "daemon off;"]