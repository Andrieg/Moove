import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../services/ses";
import DB from "../../services/dynamodb";

const loginUser = async (server: any, request: any, reply: any) => {
  const { email, client = false, target, brand } = request.body.parsed || {};
  const { APP_URL } = process.env;

  if (!email) {
    return reply.code(400).send({ status: "FAIL", error: "email_required" });
  }

  // ✅ DEV BYPASS: no AWS/Dynamo/SES required
  if (process.env.NODE_ENV !== "production") {
    const userId = uuidv4();
    const token = server.jwt.sign(
      { email, id: userId, brand },
      { expiresIn: "14d", noTimestamp: true }
    );
    const link = `${(client ? target : APP_URL) || "http://127.0.0.1:3000"}/auth?token=${token}`;

    return reply.send({
      status: "SUCCESS",
      user: userId,
      token,
      link,
    });
  }

  // ✅ PRODUCTION PATH (unchanged behaviour)
  const exists = await DB.USERS.get(email);

  if (!!exists?.Items?.length) {
    const user = exists.Items[0];

    if (!user.id) {
      user.id = uuidv4() as any;
      await DB.USERS.update(user as any, ["id"]);
    }

    const token = server.jwt.sign(
      { email, id: user.id, brand },
      { expiresIn: "14d", noTimestamp: true }
    );

    if (token) {
      const link = `${!!client ? target : APP_URL}/auth?token=${token}`;
      sendEmail(email, "TokenEmail", { link });

      return reply.send({
        status: "SUCCESS",
        user: user.id,
      });
    }

    return reply.send({ status: "FAIL", error: "token" });
  }

  return reply.send({ status: "FAIL", error: "wrong", code: 1001 });
};

export { loginUser };
