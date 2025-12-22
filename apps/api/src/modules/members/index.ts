import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DB from '../../services/dynamodb';

dayjs.extend(customParseFormat);

const updateMember = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { member, fields } = request.body.parsed;

  if (!member || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.MEMBERS.update(member, fields);

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

const getMembersByCoach = async (request: any, reply: any) => {
  const email = request?.user?.email;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const members = await DB.MEMBERS.getByCoach(email);

  if (!!members?.Items) {
    

    return reply.send({
      status: 'SUCCESS',
      members: !!members?.Items?.length ? members.Items : []
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};


export {
  updateMember,
  getMembersByCoach,
}
