import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createChallange  = async (request: any, reply: any) => {
  const { user } = request;
  const { challange } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.CHALLANGES.put({
      ...challange,
      email: user.email,
      id: uuidv4()
    });
  
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        challenge: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const updateChallange = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { challange, fields } = request.body.parsed;

  if (!challange || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.CHALLANGES.update(challange, fields);

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

const getAllChallanges = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const challanges = await DB.CHALLANGES.getAll(email);

  if (!!challanges?.Items) {
    return reply.send({
      status: 'SUCCESS',
      challenges: !!challanges?.Items?.length ? challanges.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const deleteChallange = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  const challange = {
    PK: `USER#${email}`,
    SK: `CHALLANGE#${id}`
  }

  const result = await DB.CHALLANGES.delete(challange);

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
  createChallange,
  updateChallange,
  getAllChallanges,
  deleteChallange,
}
