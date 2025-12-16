import DB from '../../services/dynamodb';

const getLandingpage = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { id } = request.params;

  if (!email) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const result = await DB.LPS.get(email, id);

  if (!!result?.Items?.length) {
    return reply.send({
      status: 'SUCCESS',
      landingpage: result.Items[0],
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'wrong'
  });
};

const getLandingpageByBrand = async (request: any, reply: any) => {
  const { id } = request.params;

  if (!id) {
    return reply.send({
      status: 'FAIL',
      error: 'missing params'
    });
  }

  const result = await DB.LPS.getByBrand(id);

  if (!!result?.Items?.length) {
    const landingpage: any = result.Items[0];
    const resultUser = await DB.USERS.get(landingpage.email);

    if (!!resultUser?.Items?.length) {
      const user = resultUser.Items[0];
      landingpage.logo = user.brand_logo;
      landingpage.brand_name = user.brand_name;
      landingpage.theme_color = user.theme_color;
      landingpage.currency = user.currency;
      landingpage.acc_stripe_id = user.acc_stripe_id;

      if (landingpage.membership) {
        const resultMembership = await DB.BILLING.get(user.acc_stripe_id as string);

        if (!!resultMembership?.Items?.length) {
          const membership = resultMembership.Items[0];
          landingpage.plan = membership.membership;
        }
      }

      return reply.send({
        status: 'SUCCESS',
        landingpage,
      });
    }
  }

  return reply.send({
    status: 'FAIL',
    error: 'not found'
  });
};

const createLandingpage = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { landingpage } = request.body.parsed;

  if (!email || !landingpage) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const result = await DB.LPS.put({
    ...landingpage,
    email,
  });


  if (result) {
    return reply.send({
      status: 'SUCCESS',
      landingpage: result
    });
  }

  return reply.send({
    status: 'FAIL',
    error: 'save'
  });
};

const updateLandingpage = async (request: any, reply: any) => {
  const { email } = request?.user;
  const { landingpage, fields } = request.body.parsed;

  if (!landingpage || !email || !fields?.length) {
    return reply.send({
      status: 'FAIL',
      error: 'wrong'
    });
  }

  const result = await DB.LPS.update(landingpage, fields);

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

export {
  getLandingpage,
  updateLandingpage,
  createLandingpage,
  getLandingpageByBrand
}
