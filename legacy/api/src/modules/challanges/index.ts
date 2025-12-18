import DB from '../../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const createChallange  = async (request: any, reply: any) => {
  const { user } = request;
  const { challenge } = request.body.parsed;

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    const newChallenge = {
      ...challenge,
      id: uuidv4(),
      email: user?.email || "dev@moove.test",
      createdAt: new Date().toISOString(),
    };
    
    return reply.send({
      status: 'SUCCESS',
      challenge: newChallenge
    });
  }

  if (!!user?.email) {
    const result = await DB.CHALLANGES.put({
      ...challenge,
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
  const { challenge, fields } = request.body.parsed;

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    return reply.send({
      status: 'SUCCESS',
      challenge: {
        ...challenge,
        updatedAt: new Date().toISOString(),
      }
    });
  }

  if (!challenge || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }


  const result = await DB.CHALLANGES.update(challenge, fields);

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

  // ✅ DEV BYPASS: Return mock challenges without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    const mockChallenges = [
      {
        id: uuidv4(),
        title: "30 Day Strength Challenge",
        startDate: "2024-12-01T00:00:00Z",
        endDate: "2024-12-31T23:59:59Z",
        coachId: email,
        description: "Build strength over 30 days with progressive workouts",
      },
      {
        id: uuidv4(),
        title: "New Year Fitness Challenge",
        startDate: "2025-01-01T00:00:00Z",
        endDate: "2025-01-31T23:59:59Z",
        coachId: email,
        description: "Start the new year right with daily workouts",
      },
    ];

    return reply.send({
      status: 'SUCCESS',
      challenges: mockChallenges
    });
  }

  // ✅ PRODUCTION PATH (unchanged behaviour)
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

const getChallangeById = async (request: any, reply: any) => {
  const { id } = request.params;
  const email = request?.user?.email;

  // DEV BYPASS: Return mock challenge by ID in development
  if (process.env.NODE_ENV !== "production") {
    const mockChallenge = {
      id: id,
      title: "30 Day Strength Challenge",
      startDate: "2024-12-01T00:00:00Z",
      endDate: "2024-12-31T23:59:59Z",
      coachId: email || "dev@moove.test",
      description: "Build strength over 30 days with progressive workouts. Each day includes targeted exercises designed to build functional strength.",
    };

    return reply.send({
      status: 'SUCCESS',
      challenge: mockChallenge
    });
  }

  // Production path
  const challange = await DB.CHALLANGES.getById?.(email, id);

  if (challange) {
    return reply.send({
      status: 'SUCCESS',
      challenge: challange
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'not found',
    code: 1002
  });
};

const deleteChallange = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  // ✅ DEV BYPASS: Return mock success response without AWS/DynamoDB
  if (process.env.NODE_ENV !== "production") {
    return reply.send({
      status: 'SUCCESS'
    });
  }

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
  getChallangeById,
  deleteChallange,
}
