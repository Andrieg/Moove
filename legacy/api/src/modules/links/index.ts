import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createLink  = async (request: any, reply: any) => {
  const { user } = request;
  const { link } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.LINKS.put({
      ...link,
      email: user.email,
      id: uuidv4()
    });
  
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        link: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const getLinks = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const links = await DB.LINKS.get(email);

  if (!!links?.Items) {
    return reply.send({
      status: 'SUCCESS',
      links: !!links?.Items?.length ? links.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

const updateLink = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { link, fields } = request.body.parsed;

  if (!link || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.LINKS.update(link, fields);

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

const deleteLink = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  const link = {
    PK: `USER#${email}`,
    SK: `LINK#${id}`
  }

  const result = await DB.LINKS.delete(link);

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
  createLink,
  getLinks,
  updateLink,
  deleteLink
}
