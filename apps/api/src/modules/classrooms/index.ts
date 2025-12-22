import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createClassroom  = async (request: any, reply: any) => {
  const { user } = request;
  const { classroom } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.CLASSROOMS.put({
      ...classroom,
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

const updateClassroom = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { classroom, fields } = request.body.parsed;

  if (!classroom || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.CLASSROOMS.update(classroom, fields);

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

const getClassrooms = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const classrooms = await DB.CLASSROOMS.get(email);

  if (!!classrooms?.Items) {
    return reply.send({
      status: 'SUCCESS',
      classrooms: !!classrooms?.Items?.length ? classrooms.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const deleteClassroom = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  const classroom = {
    PK: `USER#${email}`,
    SK: `CLASSROOM#${id}`
  }

  const result = await DB.CLASSROOMS.delete(classroom);

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
  createClassroom,
  updateClassroom,
  getClassrooms,
  deleteClassroom,
}
