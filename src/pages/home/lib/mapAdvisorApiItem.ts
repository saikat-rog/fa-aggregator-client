import type { AdvisorCardData } from "../../../components/advisor/AdvisorCard";
import type { AdvisorApiItem } from "../Home.types";

export function mapAdvisorApiItem(item: AdvisorApiItem): AdvisorCardData {
  return {
    id: item.id,
    name: item.name?.trim() || "Verified Advisor",
    username: item.username || "Anonymous",
    industries: item.industries ?? [],
    country: item.country || "Unknown country",
    state: item.state || "Unknown state",
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
  };
}
