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

export {
  createVideo,
  updateVideo,
  getVideos,
  deleteVideo,
}
