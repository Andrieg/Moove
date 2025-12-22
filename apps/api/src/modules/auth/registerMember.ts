import { v4 as uuidv4 } from 'uuid';
import DB from '../../services/dynamodb';
import { sendEmail } from '../../services/ses';

const registerMemberUser = async (server: any, request: any, reply: any) => {
  const { email, coach_email, brand, target, firstName, lastName } = request.body.parsed;

  // ✅ DEV BYPASS: Return mock success with token without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    const id = uuidv4();
    const token = server.jwt.sign({ email, id, brand, role: "member" });
    
    return reply.send({
      status: 'SUCCESS',
      token,
      user: {
        id,
        email,
        firstName,
        lastName,
        role: 'member',
        brand,
      }
    });
  }

  const exists = await DB.USERS.get(email);
  if (!!exists?.Items?.length) {
    const user: any = exists?.Items[0];
    const joined = user.brands?.length ? user.brands.find((userBrand: string) => userBrand === brand) : null;
  
    if (!!joined) {
      return reply.send({
        status: 'FAIL',
        error: 'exists'
      });
    }

    const member = {
      email,
      coach_email,
      id: brand,
      role: 'member',
      status: 'inactive'
    }

    await DB.MEMBERS.put(member);
    user.brands.push(brand);
    const updated = await DB.USERS.update(user, ['brands']);

    if (updated) {
      const token = server.jwt.sign({ email, id: user.id, brand });
      sendEmail(email, 'TokenEmail', { link: `${target}/auth?token=${token}`});

      return reply.send({
        status: 'SUCCESS',
        user: updated,
      });
    }
  } else {
    const id = uuidv4() as any;
    const token = server.jwt.sign({ email, id, brand });
    const member = {
      email,
      coach_email,
      id: brand,
      role: 'member',
      status: 'inactive'
    }

    await DB.MEMBERS.put(member);

    const result = await DB.USERS.put({
      email,
      id,
      brands: [brand],
    });

    if (result) {
      sendEmail(email, 'TokenEmail', { link: `${target}/auth?token=${token}`});

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
  registerMemberUser
};
