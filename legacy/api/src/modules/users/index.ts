import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';
import lp from "./landingpage.json";
import { LandingPage } from '../../services/dynamodb/lps';
import logger from '../../utils/logger';

const whoAmI = async (request: any, reply: any) => {
  const { user } = request;
  
  // ✅ DEV BYPASS: Return mock user data without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production" && user?.email) {
    const mockUser = {
      id: user.id || uuidv4(),
      email: user.email,
      role: user.brand ? 'member' : 'coach',
      brand: user.brand,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    logger.info('[DEV] /users/me mock response', { mockUser });
    
    return reply.send({
      status: 'SUCCESS',
      user: mockUser,
    });
  }
  
  // ✅ PRODUCTION PATH (unchanged behaviour)
  if (!!user?.email) {
    const result = await DB.USERS.get(user.email);
    if (!!result?.Items?.length) {
      const userResult: any = result.Items[0];

      if (!!user.brand) {
        const lpResult = await DB.LPS.getByBrand(user.brand);

        if (!!lpResult?.Items?.length) {
          const lp: any = lpResult.Items[0];
          logger.info('[lp /me]', { lp });

          if (userResult.role === 'member' && userResult.brands?.includes(user.brand)) {
            const resultMember = await DB.MEMBERS.get(lp.email, userResult.email);
            const resultCoach = await DB.USERS.get(lp.email);
            if (!!resultMember?.Items?.length && !!resultCoach?.Items?.length) {
              const member: any = resultMember.Items[0];
              const coach: any = resultCoach.Items[0];
              userResult.theme_color = coach.theme_color;
              userResult.logo = coach.brand_logo;
              userResult.status = member.status;
              userResult.updatedAt = member.updatedAt;
              userResult.coach_email = lp.email;
              const challangesResult = await DB.CHALLANGES.getAll(user.email);
              const videosResult = await DB.VIDEOS.get(user.email);
              const liveResult = await DB.LIVES.get(user.email);
              const classroomsResults = await DB.CLASSROOMS.get(user.email);
            
              userResult.content = {
                lives: liveResult?.Items,
                challanges: challangesResult?.Items,
                classrooms: classroomsResults?.Items,
                videos: videosResult?.Items,
              }
            }
            logger.info('[user member /me]', { userResult });

            return reply.send({
              status: 'SUCCESS',
              user: userResult,
            });
          } else if (userResult?.brand_domain === user.brand) {
            userResult.role = 'coach';
            userResult.logo = userResult.brand_logo;
            userResult.status = 'active';

            logger.info('[user coach /me]', { userResult });

            return reply.send({
              status: 'SUCCESS',
              user: userResult,
            });
          }
        }
      } else if (userResult.role !== 'member') {
        return reply.send({
          status: 'SUCCESS',
          user: userResult,
        });
      }
    } 
  }

  return reply.send({
    status: 'FAILED',
    error: {
      message: 'unathorised',
      code: 1001,
    }
  });
};

const updateUser = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { user, fields } = request.body.parsed;

  if (!user || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  if (fields.includes('brand_domain')) {
    const lpResult = await DB.LPS.getByBrand(user.brand_domain);
    if (!!lpResult?.Items?.length) {
      const landingpage: any = lpResult.Items[0];
      if (email !== landingpage.email) {
        return reply.send({
          status: 'ERROR',
          error: {
            field: 'brand_domain',
            message: 'Subdomain already taken, please try a different subdomain'
          }
        });
      }
    }

    const userResult = await DB.USERS.get(email);
    if (!!userResult?.Items?.length) {
      const saved: any = userResult.Items[0];
      if (!!saved?.brand_domain) {
        const lpResult = await DB.LPS.getByBrand(saved.brand_domain);
        if (!!lpResult?.Items?.length) {
          const landingpage: any = lpResult.Items[0];
          const updatedLP = {
            ...landingpage,
            'PK': `LP#${user.brand_domain}`,
            brand: user.brand_domain
          };
 
          await DB.LPS.put(updatedLP);
          await DB.LPS.delete(landingpage);
        } else {
          const landingpage: LandingPage = {
            ...lp,
            brand: user.brand_domain,
            email,
          }
          await DB.LPS.put(landingpage);
        }
      } else {
        const landingpage: LandingPage = {
          ...lp,
          brand: user.brand_domain,
          email,
        }
        await DB.LPS.put(landingpage);
      } 
    }
  }

  const result = await DB.USERS.update(user, fields);

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

const createTrainer = async (request: any, reply: any) => {
  const coach_email = request?.user?.email;
  const { trainer } = request.body.parsed;

  if (!coach_email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const result = await DB.USERS.putTrainer({
    ...trainer,
    coach_email,
    id: uuidv4()
  });


  if (result) {
    return reply.send({
      status: 'SUCCESS',
      trainer: result
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'save'
  });
};

const getTrainersbyCoach = async (request: any, reply: any) => {
  const coach_email = request?.user?.email;

  if (!coach_email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const trainers = await DB.USERS.getTrainers(coach_email);

  if (trainers) {
    return reply.send({
      status: 'SUCCESS',
      trainers
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong',
    code: 1001
  });
};

export {
  whoAmI,
  updateUser,
  createTrainer,
  getTrainersbyCoach,
};
