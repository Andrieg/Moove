const createLink = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Links not yet implemented in Supabase", code: 5001 },
  });
};

const getLinks = async (request: any, reply: any) => {
  return reply.send({
    status: "SUCCESS",
    links: [],
  });
};

const updateLink = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Links not yet implemented in Supabase", code: 5001 },
  });
};

const deleteLink = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Links not yet implemented in Supabase", code: 5001 },
  });
};

export { createLink, getLinks, updateLink, deleteLink };
