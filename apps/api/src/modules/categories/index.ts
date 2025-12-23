const createCategory = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Categories not yet implemented in Supabase", code: 5001 },
  });
};

const getCategories = async (request: any, reply: any) => {
  return reply.send({
    status: "SUCCESS",
    categories: [],
  });
};

export { createCategory, getCategories };
