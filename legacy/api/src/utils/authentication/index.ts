import fp from "fastify-plugin";

const authenticate = fp(async function(fastify, opts) {
  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      console.log('error', err)
      reply.send(err)
    }
  });
});

export default authenticate;