import { v4 as uuidv4 } from 'uuid';
import DB from '../../services/dynamodb';
import { sendEmail } from '../../services/ses';

const registerUser = async (server: any, request: any, reply: any) => {
  const { email } = request.body.parsed;
  

  const exists = await DB.USERS.get(email);

  if (!exists?.Items?.length) {
    const id = uuidv4() as any;
    const token = server.jwt.sign({ email, id });
    const result = await DB.USERS.put({
      email,
      id,
      role: 'coach',
    });

    if (result) {
      sendEmail(email, 'TokenEmail', { link: `${process.env.APP_URL}/auth?token=${token}`});

      return reply.send({
        status: 'SUCCESS',
        user: id
      });
    }

    return reply.send({
      status: 'FAIL',
      error: 'save'
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'exists'
  });
}

export {
  registerUser
};
