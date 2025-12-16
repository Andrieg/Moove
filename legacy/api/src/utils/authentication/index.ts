import fp from "fastify-plugin";

const authenticate = fp(async function(fastify, opts) {
  fastify.decorate("authenticate", async function(request, reply) {
    // DEV BYPASS: Auto-authenticate with mock user in development
    if (process.env.NODE_ENV !== "production") {
      request.user = {
        email: "dev@moove.test",
        id: "dev-user-001",
        name: "Dev User"
      };
      return;
    }

    try {
      await request.jwtVerify()
    } catch (err) {
      console.log('error', err)
      reply.send(err)
    }
  });
});

export default authenticate;