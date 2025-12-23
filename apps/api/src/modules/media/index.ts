import logger from "../../utils/logger";

const uploadAvatar = async (server: any, request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: {
      message: "File upload not yet implemented. Use Supabase Storage directly from the client.",
      code: 5001,
    },
  });
};

const uploadVideo = async (server: any, request: any, reply: any) => {
  return reply.code(501).send({
    status: "FAILED",
    error: {
      message: "File upload not yet implemented. Use Supabase Storage directly from the client.",
      code: 5001,
    },
  });
};

export { uploadAvatar, uploadVideo };
