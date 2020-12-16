FROM node:14-stretch-slim

ENV NODE_ENV=production

WORKDIR /usr/app

ENV UID="1000" \
    UNAME="developer" \
    GID="1000" \
    GNAME="developer" \
    SHELL="/bin/bash" \
    UHOME=/usr/app

# Create home & user
RUN mkdir -p "${UHOME}" \
    && echo "${UNAME}:x:${UID}:${GID}:${UNAME},,,:${UHOME}:${SHELL}" >> /etc/passwd \
    && echo "${UNAME}::17032:0:99999:7:::" >> /etc/shadow

COPY dist /usr/app/dist

COPY node_modules /usr/app/node_modules
COPY package.json /usr/app/package.json
COPY .npmrc /usr/app/.npmrc

RUN chown -R ${UID}:${GID} ${UHOME}

USER $UNAME

CMD npm run start
