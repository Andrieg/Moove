import Fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const createServer = () => {
  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
    ignoreTrailingSlash: true
  });

  server.setErrorHandler((error, req, res) => {
    req.log.error(error.toString());
    res.send({ error });
  });

  return server;
}

export default createServer;