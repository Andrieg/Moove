import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DB from '../../services/dynamodb';

dayjs.extend(customParseFormat);

const createLiveClass = async (request: any, reply: any) => {
  const { user } = request;
  const { live } = request.body.parsed;


  if (!!user?.email) {
    const repeat = parseInt(live?.repeat || 0, 10);

    if (repeat > 0) {
      Promise.all([...Array(repeat)].map(async (_, i) => {
        const initialDate = dayjs(live.date, 'YYYY-MM-DD');

        const clone = {
          ...live,
          date: initialDate.add(i + 1, 'week').format('YYYY-MM-DD'),
          email: user.email,
          id: uuidv4()
        }

        await DB.LIVES.put(clone);
      }));
    }

    const result = await DB.LIVES.put({
      ...live,
      email: user.email,
      id: uuidv4()
    });
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        live: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const updateLiveClass = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { live, fields } = request.body.parsed;

  if (!live || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.LIVES.update(live, fields);

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

const getLiveClass = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const lives = await DB.LIVES.get(email);

  if (!!lives?.Items) {
    return reply.send({
      status: 'SUCCESS',
      lives: lives.Items,
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const deleteLiveClass = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  const live = {
    PK: `USER#${email}`,
    SK: `LIVE#${id}`
  }

  const result = await DB.LIVES.delete(live);

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
  createLiveClass,
  updateLiveClass,
  getLiveClass,
  deleteLiveClass,
}
