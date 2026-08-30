import type { AdvisorCardData } from "../../../components/advisor/AdvisorCard";
import type { AdvisorApiItem } from "../Home.types";

export function mapAdvisorApiItem(item: AdvisorApiItem): AdvisorCardData {
  const normalizedCategory = item.category?.trim() ?? "";
  const normalizedPpp =
    typeof item.ppp === "number" && Number.isFinite(item.ppp) ? item.ppp : null;

  const totalFollowers =
    (item.instagramFollowers || 0) +
    (item.linkedinFollowers || 0) +
    (item.twitterFollowers || 0) +
    (item.facebookFollowers || 0) +
    (item.youtubeSubscribers || 0) +
    (item.tiktokFollowers || 0);

  return {
    id: item.id,
    name: item.name?.trim() || "Verified Advisor",
    username: item.username || "Anonymous",
    pincode: item.pincode?.trim() || "",
    industries: item.industries ?? [],
    country: item.country?.trim() || "",
    state: item.state?.trim() || "",
    marketFocus: item.marketFocus || ["All Markets"],
    specialties: item.expertiseIndeces?.length
      ? item.expertiseIndeces
      : item.marketFocus?.length
        ? item.marketFocus
        : ["General Planning"],
    about: item.about || item.emailForContact || "No advisor bio available yet.",
    profilePictureUrl: item.profilePictureUrl || undefined,
    personalWebsite: item.personalWebsite,
    emailForContact: item.emailForContact,
    socialLinks: item.socialLinks,
    ppp: normalizedPpp,
    category: normalizedCategory || null,
    instagramFollowers: item.instagramFollowers ?? null,
    linkedinFollowers: item.linkedinFollowers ?? null,
    twitterFollowers: item.twitterFollowers ?? null,
    facebookFollowers: item.facebookFollowers ?? null,
    youtubeSubscribers: item.youtubeSubscribers ?? null,
    tiktokFollowers: item.tiktokFollowers ?? null,
    followersCount: totalFollowers || item.instagramFollowers || null,
    instagramEngagementRateScore: item.instagramEngagementRateScore ?? null,
  };
}
