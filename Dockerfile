FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY packages/blog/dist/ /srv/blog/

HEALTHCHECK CMD wget -q -T 3 -O /dev/null http://127.0.0.1:8080/ || exit 1
