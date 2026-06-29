import type { AdvisorCardData } from "../../components/advisor/AdvisorCard";
export type { AdvisorCardData };

export interface AdvisorApiItem {
  id: string;
  profilePictureUrl?: string | null;
  name?: string;
  country?: string;
  state?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  instagramEngagementRateScore?: number;
  instagramFollowers?: number;
  linkedinFollowers?: number;
  twitterFollowers?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  about?: string;
  marketFocus?: string[];
  expertiseIndeces?: string[];
  emailForContact?: string;
  personalWebsite?: string;
  username?: string;
  industries?: string[];
  ppp?: number | null;
  category?: string | null;
}

export type AdvisorPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdvisorFilters = {
  page: number;
  limit: number;
  country: string;
  state: string;
  category: string;
  industries: string[];
  instagramFollowersGt: string;
  instagramFollowersGte: string;
  youtubeSubscribersGt: string;
  youtubeSubscribersGte: string;
  tiktokFollowersGt: string;
  tiktokFollowersGte: string;
  linkedinFollowersGt: string;
  linkedinFollowersGte: string;
  facebookFollowersGt: string;
  facebookFollowersGte: string;
  twitterFollowersGt: string;
  twitterFollowersGte: string;
};

export type HomePageProps = {
  initialFiltersOverride?: Partial<AdvisorFilters>;
  disableUrlSync?: boolean;
};

export type HomePageDataState = {
  advisors: AdvisorCardData[];
  pagination: AdvisorPagination;
  isLoading: boolean;
  error: string;
};
