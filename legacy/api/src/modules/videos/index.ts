import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createVideo  = async (request: any, reply: any) => {
  const { user } = request;
  const { video } = request.body.parsed;

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    const newVideo = {
      ...video,
      id: uuidv4(),
      email: user?.email || "dev@moove.test",
      createdAt: new Date().toISOString(),
    };
    
    return reply.send({
      status: 'SUCCESS',
      video: newVideo
    });
  }

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

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    return reply.send({
      status: 'SUCCESS',
      video: {
        ...video,
        updatedAt: new Date().toISOString(),
      }
    });
  }

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
  const { brand } = request.query || {};

  // ✅ DEV BYPASS: Return mock videos without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    // Mock videos with brand association
    const mockVideos = [
      {
        id: "video-1",
        title: "Full Body HIIT Workout",
        durationSeconds: 1800,
        published: true,
        brand: "annamartin",
        coachId: "coach@annamartin.com",
        cover: { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400" },
        description: "High-intensity interval training for full body conditioning",
        target: "Full Body",
        goal: "Fat Loss",
        type: "HIIT",
      },
      {
        id: "video-2",
        title: "Yoga Flow for Beginners",
        durationSeconds: 2400,
        published: true,
        brand: "annamartin",
        coachId: "coach@annamartin.com",
        cover: { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
        description: "Relaxing yoga flow to improve flexibility and mindfulness",
        target: "Full Body",
        goal: "Flexibility",
        type: "Yoga",
      },
      {
        id: "video-3",
        title: "Upper Body Strength Training",
        durationSeconds: 2700,
        published: true,
        brand: "annamartin",
        coachId: "coach@annamartin.com",
        cover: { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
        description: "Build muscle with compound movements",
        target: "Upper Body",
        goal: "Muscle Gain",
        type: "Strength",
      },
    ];

    // Filter by brand if provided
    const filteredVideos = brand 
      ? mockVideos.filter(v => v.brand === brand)
      : mockVideos;

    return reply.send({
      status: 'SUCCESS',
      videos: filteredVideos
    });
  }

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
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

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    return reply.send({
      status: 'SUCCESS'
    });
  }

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
