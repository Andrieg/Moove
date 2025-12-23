const loginUser = async (server: any, request: any, reply: any) => {
  return reply.code(410).send({
    status: "FAILED",
    error: {
      message: "This endpoint is deprecated. Use Supabase Auth for login.",
      code: 4100,
    },
  });
};

export { loginUser };
