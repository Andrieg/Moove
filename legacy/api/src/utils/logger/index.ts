import winston from 'winston';
import Sentry from 'winston-transport-sentry-node';

const options = {
  sentry: {
    dsn: 'https://37852aaced1647f3b4ee4325c16524b5@o430312.ingest.sentry.io/5985333',
  },
  level: 'info'
};

const logger = winston.createLogger({
  transports: [
    new Sentry(options)
  ]
});

export default logger;
