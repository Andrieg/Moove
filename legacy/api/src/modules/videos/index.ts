import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createVideo  = async (request: any, reply: any) => {
  const { user } = request;
  const { video } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.VIDEOS.put({
      ...video,
      email: user.email,
      id: uuidv4()
    });
  
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        classroom: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const updateVideo = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { video, fields } = request.body.parsed;

  if (!video || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.VIDEOS.update(video, fields);

  if (!!result) {
    return reply.send({
      status: 'SUCCESS',
      user: result,
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong'
  });
};

const getVideos = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  // ✅ DEV BYPASS: Return mock videos without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    const mockVideos = [
      {
        id: uuidv4(),
        title: "Full Body HIIT Workout",
        durationSeconds: 1800,
        published: true,
        coachId: email,
        cover: { url: "" },
        description: "High-intensity interval training for full body conditioning",
        target: "Full Body",
        goal: "Fat Loss",
        type: "HIIT",
      },
      {
        id: uuidv4(),
        title: "Yoga Flow",
        durationSeconds: 2400,
        published: true,
        coachId: email,
        cover: { url: "" },
        description: "Relaxing yoga flow to improve flexibility and mindfulness",
        target: "Full Body",
        goal: "Flexibility",
        type: "Yoga",
      },
      {
        id: uuidv4(),
        title: "Strength Training",
        durationSeconds: 2700,
        published: true,
        coachId: email,
        cover: { url: "" },
        description: "Build muscle with compound movements",
        target: "Upper Body",
        goal: "Muscle Gain",
        type: "Strength",
      },
    ];

    return reply.send({
      status: 'SUCCESS',
      videos: mockVideos
    });
  }

  // ✅ PRODUCTION PATH (unchanged behaviour)
  const videos = await DB.VIDEOS.get(email);

  if (!!videos?.Items) {
    return reply.send({
      status: 'SUCCESS',
      videos: !!videos?.Items?.length ? videos.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const deleteVideo = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  const classroom = {
    PK: `USER#${email}`,
    SK: `VIDEO#${id}`
  }

  const result = await DB.VIDEOS.delete(classroom);

  if (result) {
    return reply.send({
      status: 'SUCCESS'
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const getVideoById = async (request: any, reply: any) => {
  const { id } = request.params;
  const email = request?.user?.email;

  // DEV BYPASS: Return mock video by ID in development
  if (process.env.NODE_ENV !== "production") {
    const mockVideo = {
      id: id,
      title: "Full Body HIIT Workout",
      durationSeconds: 1800,
      published: true,
      coachId: email || "dev@moove.test",
      cover: { url: "" },
      description: "High-intensity interval training for full body conditioning. This workout includes warm-up, main circuit, and cool-down phases.",
      target: "Full Body",
      goal: "Fat Loss",
      type: "HIIT",
      video: { url: "" },
    };

    return reply.send({
      status: 'SUCCESS',
      video: mockVideo
    });
  }

  // Production path (query DynamoDB)
  const video = await DB.VIDEOS.getById?.(email, id);

  if (video) {
    return reply.send({
      status: 'SUCCESS',
      video
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'not found',
    code: 1002
  });
};

export {
  createVideo,
  updateVideo,
  getVideos,
  getVideoById,
  deleteVideo,
}
