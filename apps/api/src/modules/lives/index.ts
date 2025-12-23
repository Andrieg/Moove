const createLiveClass = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Live classes not yet implemented in Supabase", code: 5001 },
  });
};

const updateLiveClass = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Live classes not yet implemented in Supabase", code: 5001 },
  });
};

const getLiveClass = async (request: any, reply: any) => {
  return reply.send({
    status: "SUCCESS",
    lives: [],
  });
};

const deleteLiveClass = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Live classes not yet implemented in Supabase", code: 5001 },
  });
};

export { createLiveClass, updateLiveClass, getLiveClass, deleteLiveClass };
