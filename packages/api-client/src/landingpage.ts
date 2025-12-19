import { apiFetch } from "./http";

// ============== LANDING PAGE SETTINGS ==============

export interface LandingPageSettings {
  brand_name: string;
  brand_slug: string;
  theme_color: string;
  about: string;
  hero_title: string;
  hero_description: string;
  hero_image: string;
  access_title: string;
  access_description: string;
  access_image: string;
  plan_title: string;
  plan_price: number;
  plan_benefits: string[];
  reviews: { name: string; text: string; rating: number }[];
  logo?: string;
  currency?: string;
}

/**
 * Get landing page settings for a specific brand (public endpoint)
 * @param brandSlug - The brand/coach slug
 */
export async function getLandingPageSettings(brandSlug: string): Promise<LandingPageSettings | null> {
  try {
    const response = await apiFetch<{ status: string; settings: LandingPageSettings }>(
      `/landingpage/settings/${encodeURIComponent(brandSlug)}`
    );
    if (response.status === "SUCCESS" && response.settings) {
      return response.settings;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch landing page settings:", error);
    return null;
  }
}

/**
 * Save landing page settings (authenticated - coach only)
 * @param settings - The landing page settings to save
 */
export async function saveLandingPageSettings(settings: LandingPageSettings): Promise<{ status: string; error?: string }> {
  try {
    const response = await apiFetch<{ status: string; settings?: LandingPageSettings; error?: string }>(
      "/landingpage/settings",
      {
        method: "POST",
        body: JSON.stringify({ settings }),
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to save landing page settings:", error);
    return { status: "FAIL", error: "Failed to save settings" };
  }
}
