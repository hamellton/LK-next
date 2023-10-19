FROM node:16.20.0 as dependencies
WORKDIR /frontend

COPY package.json yarn.lock .npmrc next.config.js ./
RUN yarn install


FROM node:16.20.0 as builder
WORKDIR /frontend




COPY --from=dependencies /frontend/node_modules ./node_modules
COPY --from=dependencies /frontend/next.config.js ./next.config.js
COPY . .

ARG APP_ENV
ARG API_URL
ARG CONFIG_URL
ARG LANG
ARG COUNTRY
ARG CLIENT
ARG SUBDIRECTORY_ROUTE
ARG PHONE_CODE
ARG LANGDIR
ARG GTM_KEY
ARG FB_PIXEL
ARG SPRINKLR_ID
ARG TRACKJS_TOKEN
ARG TRACKJS_APPLICATION
ARG NEWRELIC_KEY
ARG HOSTNAME

ENV NODE_ENV ${APP_ENV}
ENV NEXT_PUBLIC_API_URL ${API_URL}
ENV NEXT_PUBLIC_CONFIG_URL ${CONFIG_URL}
ENV NEXT_PUBLIC_APP_COUNTRY ${COUNTRY}
ENV NEXT_PUBLIC_APP_LANG ${LANG}
ENV NEXT_PUBLIC_APP_CLIENT ${CLIENT}
ENV NEXT_PUBLIC_DIRECTION ${LANGDIR}
ENV NEXT_PUBLIC_APP_ENV ${APP_ENV}
ENV NEXT_PUBLIC_BASE_ROUTE ${SUBDIRECTORY_ROUTE}
ENV NEXT_PUBLIC_PHONE_CODE ${PHONE_CODE}
ENV NEXT_PUBLIC_HOSTNAME ${HOSTNAME}
ENV NEXT_PUBLIC_GTM_ID ${GTM_KEY}
ENV NEXT_PUBLIC_FACEBOOK_ID ${FB_PIXEL}
ENV NEXT_PUBLIC_SPRINKLR_ID ${SPRINKLR_ID}
ENV NEXT_PUBLIC_TRACKJS_TOKEN ${TRACKJS_TOKEN}
ENV NEXT_PUBLIC_TRACKJS_APPLICATION ${TRACKJS_APPLICATION}
ENV NEXT_PUBLIC_NEWRELIC_KEY ${NEWRELIC_KEY}
RUN yarn build

# RUN aws s3 cp /frontend/ s3://static-web-preprod.lenskart.com/en-in/desktop/12345 --endpoint-url https://static-web-preprod.lenskart.com

FROM node:16.20.0 as runner
WORKDIR /frontend

ARG APP_ENV
ARG API_URL
ARG CONFIG_URL
ARG LANG
ARG COUNTRY
ARG CLIENT
ARG SUBDIRECTORY_ROUTE
ARG PHONE_CODE
ARG LANGDIR
ARG GTM_KEY
ARG FB_PIXEL
ARG SPRINKLR_ID
ARG TRACKJS_TOKEN
ARG TRACKJS_APPLICATION
ARG NEWRELIC_KEY
ARG HOSTNAME
ARG TARGETPLATFORM
ARG CURRENT_DATE

ENV NODE_ENV ${APP_ENV}
ENV NEXT_PUBLIC_API_URL ${API_URL}
ENV NEXT_PUBLIC_CONFIG_URL ${CONFIG_URL}
ENV NEXT_PUBLIC_APP_COUNTRY ${COUNTRY}
ENV NEXT_PUBLIC_APP_LANG ${LANG}
ENV NEXT_PUBLIC_APP_CLIENT ${CLIENT}
ENV NEXT_PUBLIC_DIRECTION ${LANGDIR}
ENV NEXT_PUBLIC_APP_ENV ${APP_ENV}
ENV NEXT_PUBLIC_BASE_ROUTE ${SUBDIRECTORY_ROUTE}
ENV NEXT_PUBLIC_PHONE_CODE ${PHONE_CODE}
ENV NEXT_PUBLIC_HOSTNAME ${HOSTNAME}
ENV NEXT_PUBLIC_GTM_ID ${GTM_KEY}
ENV NEXT_PUBLIC_FACEBOOK_ID ${FB_PIXEL}
ENV NEXT_PUBLIC_SPRINKLR_ID ${SPRINKLR_ID}
ENV NEXT_PUBLIC_TRACKJS_TOKEN ${TRACKJS_TOKEN}
ENV NEXT_PUBLIC_TRACKJS_APPLICATION ${TRACKJS_APPLICATION}
ENV NEXT_PUBLIC_NEWRELIC_KEY ${NEWRELIC_KEY}
ENV NEXT_PUBLIC_BUILD_TIMESTAMP ${CURRENT_DATE}

RUN if [ "$TARGETPLATFORM" = "linux/arm64" ]; \
    then export zip=awscli-exe-linux-aarch64.zip; \
    else export zip=awscli-exe-linux-x86_64.zip; fi \
    && curl --silent --show-error --fail "https://awscli.amazonaws.com/${zip}" -o "awscliv2.zip"

RUN apt-get update && \
    apt-get install -y unzip curl && \
    rm -rf /var/lib/apt/lists/*

RUN unzip awscliv2.zip && \
    ./aws/install -b /usr/bin && \
    rm -f awscliv2.zip

RUN aws --version

COPY --from=builder /frontend/next.config.js ./next.config.js
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/package.json ./package.json
COPY --from=builder /frontend/newrelic.js ./newrelic.js

RUN aws s3 cp ./.next/static s3://frontend-$APP_ENV-static/${LANG}-${COUNTRY}/$CLIENT/$CURRENT_DATE/_next/static --recursive
RUN aws s3 cp ./public/ s3://frontend-$APP_ENV-static/${LANG}-${COUNTRY}/$CLIENT/$CURRENT_DATE/public/ --recursive



EXPOSE 8080
CMD yarn start
