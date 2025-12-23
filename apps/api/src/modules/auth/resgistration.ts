import { supabaseAdmin } from "../../services/supabase";
import logger from "../../utils/logger";

const registerUser = async (server: any, request: any, reply: any) => {
  const { user } = request;
  const { displayName, brandSlug, firstName, lastName } = request.body.parsed || {};

  if (!user?.id || !user?.email) {
    return reply.code(401).send({
      status: "FAILED",
      error: { message: "Unauthorized - must be authenticated first", code: 1001 },
    });
  }

  const { data: existingCoach } = await supabaseAdmin
    .from("coaches")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingCoach) {
    return reply.code(409).send({
      status: "FAILED",
      error: { message: "Coach profile already exists", code: 1002 },
    });
  }

  if (brandSlug) {
    const { data: existingSlug } = await supabaseAdmin
      .from("coaches")
      .select("id")
      .eq("brand_slug", brandSlug)
      .maybeSingle();

    if (existingSlug) {
      return reply.code(409).send({
        status: "FAILED",
        error: { message: "Brand slug already taken", code: 1003 },
      });
    }
  }

  const coachData = {
    id: user.id,
    email: user.email,
    first_name: firstName || null,
    last_name: lastName || null,
    display_name: displayName || null,
    brand_slug: brandSlug || null,
  };

  const { data, error } = await supabaseAdmin
    .from("coaches")
    .insert(coachData)
    .select()
    .single();

  if (error) {
    logger.error("[registerUser error]", { error });
    return reply.code(500).send({
      status: "FAILED",
      error: { message: "Failed to create coach profile", code: 1004 },
    });
  }

  return reply.send({ status: "SUCCESS", user: data });
};

export { registerUser };
