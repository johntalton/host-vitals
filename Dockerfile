FROM jotalt/rpi-nodejs:15.6.0

RUN npm install mqtt

CMD ["node", "vitals"]
