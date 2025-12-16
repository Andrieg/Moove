import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createLocation  = async (request: any, reply: any) => {
  const { user } = request;
  const { location } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.LOCATIONS.put({
      ...location,
      email: user.email,
      id: uuidv4()
    });
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        location: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const getLocations = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const locations = await DB.LOCATIONS.get(email);

  if (!!locations?.Items) {
    return reply.send({
      status: 'SUCCESS',
      locations: !!locations?.Items?.length ? locations.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

export {
  createLocation,
  getLocations,
}
