FROM jotalt/rpi-nodejs:15.2.0

# USER node

WORKDIR /host-vitals
RUN mkdir -p  node_modules
RUN npm install --quiet mqtt
COPY vitals.js .

CMD ["node", "vitals"]
