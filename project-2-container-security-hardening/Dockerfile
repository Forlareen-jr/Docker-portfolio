FROM nginx@sha256:62ff2089abf5a9ed33bd232895bef5e22f7bb4b200675cec49a5ebc48e3d4ac8

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY script.js /usr/share/nginx/html/script.js

RUN apk upgrade --no-cache \
    && mkdir -p \
        /tmp/client_temp \
        /tmp/proxy_temp \
        /tmp/fastcgi_temp \
        /tmp/uwsgi_temp \
        /tmp/scgi_temp \
    && chown -R nginx:nginx /tmp \
    && chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080

USER nginx

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
