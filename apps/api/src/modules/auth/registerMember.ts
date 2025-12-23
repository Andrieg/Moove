import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const registerMemberUser = async (server: any, request: any, reply: any) => {
  const { user } = request;
  const { coachId, brandSlug, firstName, lastName } = request.body.parsed || {};

  if (!user?.id || !user?.email) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized - must be authenticated first", code: 1001 },
    });
  }

  const { data: existingMember } = await supabaseAdmin
    .from("members")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingMember) {
    return reply.code(409).send({
      status: "FAILED",
      error: { message: "Member profile already exists", code: 1002 },
    });
  }

  let targetCoachId = coachId;

  if (!targetCoachId && brandSlug) {
    const { data: coach } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (!coach) {
      return reply.code(404).send({
        status: "FAILED",
        error: { message: "Coach not found", code: 1003 },
      });
    }
    targetCoachId = coach.id;
  }

  if (!targetCoachId) {
    return reply.code(400).send({
      status: "FAILED",
      error: { message: "Coach ID or brand slug required", code: 1004 },
    });
  }

  const memberData = {
    id: user.id,
    email: user.email,
    coach_id: targetCoachId,
    first_name: firstName || null,
    last_name: lastName || null,
    status: "active",
  };

  const { data, error } = await supabaseAdmin
    .from("members")
    .insert(memberData)
    .select()
    .single();

  if (error) {
    logger.error("[registerMemberUser error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create member profile", code: 1005 },
    });
  }

  return reply.send({ status: "SUCCESS", user: data });
};

export { registerMemberUser };
