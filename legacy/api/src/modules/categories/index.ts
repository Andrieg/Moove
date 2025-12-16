import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createCategory  = async (request: any, reply: any) => {
  const { user } = request;
  const { category } = request.body.parsed;


  if (!!user?.email) {
    const result = await DB.CATEGORIES.put({
      ...category,
      email: user.email,
      id: uuidv4()
    });
  
  
    if (result) {
      return reply.send({
        status: 'SUCCESS',
        category: result
      });
    }
  
    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }
};

const getCategories = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const categories = await DB.CATEGORIES.get(email);

  if (!!categories?.Items) {
    return reply.send({
      status: 'SUCCESS',
      categories: !!categories?.Items?.length ? categories.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

export {
  createCategory,
  getCategories,
}
