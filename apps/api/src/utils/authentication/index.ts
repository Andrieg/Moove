import fp from "fastify-plugin";
import { verifySupabaseToken, getCoachById, getMemberById } from "../../services/supabase";

const authenticate = fp(async function (fastify, opts) {
  fastify.decorate("authenticate", async function (request: any, reply: any) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({
        status: "FAILED",
        error: {
          message: "Missing or invalid authorization header",
          code: 1001,
        },
      });
    }

    const token = authHeader.substring(7);

    try {
      const supabaseUser = await verifySupabaseToken(token);

      if (!supabaseUser) {
        return reply.code(401).send({
          status: "FAILED",
          error: {
            message: "Invalid or expired token",
            code: 1002,
          },
        });
      }

      const coach = await getCoachById(supabaseUser.id);
      if (coach) {
        request.user = {
          id: coach.id,
          email: coach.email,
          role: "coach",
          firstName: coach.first_name,
          lastName: coach.last_name,
          brandSlug: coach.brand_slug,
          displayName: coach.display_name,
        };
        return;
      }

      const member = await getMemberById(supabaseUser.id);
      if (member) {
        request.user = {
          id: member.id,
          email: member.email,
          role: "member",
          firstName: member.first_name,
          lastName: member.last_name,
          coachId: member.coach_id,
          brandSlug: member.coaches?.brand_slug,
        };
        return;
      }

      request.user = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: "unknown",
      };
    } catch (err) {
      console.error("Authentication error:", err);
      return reply.code(401).send({
        status: "FAILED",
        error: {
          message: "Authentication failed",
          code: 1003,
        },
      });
    }
  });
});

export default authenticate;
