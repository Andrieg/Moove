const createClassroom = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Classrooms not yet implemented in Supabase", code: 5001 },
  });
};

const updateClassroom = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Classrooms not yet implemented in Supabase", code: 5001 },
  });
};

const getClassrooms = async (request: any, reply: any) => {
  return reply.send({
    status: "SUCCESS",
    classrooms: [],
  });
};

const deleteClassroom = async (request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: { message: "Classrooms not yet implemented in Supabase", code: 5001 },
  });
};

export { createClassroom, updateClassroom, getClassrooms, deleteClassroom };
