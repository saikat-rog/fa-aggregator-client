import type { ReactNode } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { AdvisorFilters } from "./Home.types";

export const followerFields = [
  "instagramFollowers",
  "youtubeSubscribers",
  "tiktokFollowers",
  "linkedinFollowers",
  "facebookFollowers",
  "twitterFollowers",
] as const;

export type FollowerField = (typeof followerFields)[number];

export const followerFieldLabels: Record<FollowerField, string> = {
  instagramFollowers: "Followers (minimum)",
  youtubeSubscribers: "Subscribers (minimum)",
  tiktokFollowers: "Followers (minimum)",
  linkedinFollowers: "Followers (minimum)",
  facebookFollowers: "Followers (minimum)",
  twitterFollowers: "Followers (minimum)",
};

export const followerFieldPlatformLabels: Record<FollowerField, string> = {
  instagramFollowers: "Instagram",
  youtubeSubscribers: "YouTube",
  tiktokFollowers: "TikTok",
  linkedinFollowers: "LinkedIn",
  facebookFollowers: "Facebook",
  twitterFollowers: "X / Twitter",
};

export const followerCountOptions = [
  { label: "1K+", value: "1000" },
  { label: "5K+", value: "5000" },
  { label: "10K+", value: "10000" },
  { label: "25K+", value: "25000" },
  { label: "50K+", value: "50000" },
  { label: "100K+", value: "100000" },
  { label: "250K+", value: "250000" },
  { label: "500K+", value: "500000" },
  { label: "1M+", value: "1000000" },
] as const;

export const followerFieldUi: Record<
  FollowerField,
  {
    icon: ReactNode;
    ringClass: string;
    badgeClass: string;
    inputFocusClass: string;
  }
> = {
  instagramFollowers: {
    icon: <FaInstagram className="h-4 w-4" />,
    ringClass: "ring-pink-200",
    badgeClass: "bg-transparent text-pink-700 border-pink-200",
    inputFocusClass: "focus:border-pink-400",
  },
  youtubeSubscribers: {
    icon: <FaYoutube className="h-4 w-4" />,
    ringClass: "ring-rose-200",
    badgeClass: "bg-transparent text-rose-700 border-rose-200",
    inputFocusClass: "focus:border-rose-400",
  },
  tiktokFollowers: {
    icon: <FaTiktok className="h-4 w-4" />,
    ringClass: "ring-slate-300",
    badgeClass: "bg-transparent text-slate-800 border-slate-300",
    inputFocusClass: "focus:border-slate-500",
  },
  linkedinFollowers: {
    icon: <FaLinkedinIn className="h-4 w-4" />,
    ringClass: "ring-sky-200",
    badgeClass: "bg-transparent text-sky-700 border-sky-200",
    inputFocusClass: "focus:border-sky-400",
  },
  facebookFollowers: {
    icon: <FaFacebookF className="h-4 w-4" />,
    ringClass: "ring-indigo-200",
    badgeClass: "bg-transparent text-indigo-700 border-indigo-200",
    inputFocusClass: "focus:border-indigo-400",
  },
  twitterFollowers: {
    icon: <FaXTwitter className="h-4 w-4" />,
    ringClass: "ring-zinc-300",
    badgeClass: "bg-transparent text-zinc-900 border-zinc-900",
    inputFocusClass: "focus:border-zinc-700",
  },
};

export const initialFilters: AdvisorFilters = {
  page: 1,
  limit: 20,
  country: "",
  state: "",
  category: "",
  industries: [],
  instagramFollowersGt: "",
  instagramFollowersGte: "",
  youtubeSubscribersGt: "",
  youtubeSubscribersGte: "",
  tiktokFollowersGt: "",
  tiktokFollowersGte: "",
  linkedinFollowersGt: "",
  linkedinFollowersGte: "",
  facebookFollowersGt: "",
  facebookFollowersGte: "",
  twitterFollowersGt: "",
  twitterFollowersGte: "",
};
