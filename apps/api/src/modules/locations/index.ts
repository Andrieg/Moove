const createLocation = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Locations not yet implemented in Supabase", code: 5001 },
  });
};

const getLocations = async (request: any, reply: any) => {
  return reply.send({
    status: "SUCCESS",
    locations: [],
  });
};

export { createLocation, getLocations };
