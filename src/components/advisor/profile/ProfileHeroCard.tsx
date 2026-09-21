import {
  FaArrowUpRightFromSquare,
  FaBookmark,
  FaEnvelope,
  FaEyeSlash,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaShareNodes,
  FaTiktok,
  FaXTwitter,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa6";
import {
  getDisplayCategory,
} from "../advisorDisplay.utils";

type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  telegram?: string;
  instagramFollowers?: number;
  linkedinFollowers?: number;
  twitterFollowers?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  telegramFollowers?: number;
};

type ProfileHeroCardProps = {
  name: string;
  username: string;
  pincode?: string;
  state: string;
  country: string;
  industry?: string;
  category?: string | null;
  instagramEngagementRateScore?: number | null;
  profilePictureUrl?: string;
  personalWebsite?: string;
  emailForContact?: string;
  userCanOpenLinks: boolean;
  emailVisible: boolean;
  socialLinks: SocialLinks;
  onWebsiteOpen: (url: string) => void;
  onEmailOpen: (mailto: string) => void;
  onShareProfile: () => void;
  onSocialOpen: (url: string) => void;
  isSaved: boolean;
  saveLoading: boolean;
  onToggleSave: () => void;
  getProxiedImageUrl: (url: string) => string;
};

const socialButtonBaseClassName =
  "inline-flex min-w-[140px] cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition shadow-2xs";
const instagramButtonClassName =
  `${socialButtonBaseClassName} border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100`;
const linkedinButtonClassName =
  `${socialButtonBaseClassName} border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100`;
const twitterButtonClassName =
  `${socialButtonBaseClassName} border-[#201A2B] bg-[#201A2B] text-white hover:bg-black`;
const facebookButtonClassName =
  `${socialButtonBaseClassName} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100`;
const youtubeButtonClassName =
  `${socialButtonBaseClassName} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`;
const tiktokButtonClassName =
  `${socialButtonBaseClassName} border-[#E7E1D6] bg-[#FAF8F5] text-[#201A2B] hover:bg-[#F0ECE4]`;
const telegramButtonClassName =
  `${socialButtonBaseClassName} border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100`;

const instagramCountBadgeClassName =
  "rounded-full bg-pink-700 px-2 py-0.5 text-[10px] font-bold text-white";
const linkedinCountBadgeClassName =
  "rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold text-white";
const twitterCountBadgeClassName =
  "rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black";
const facebookCountBadgeClassName =
  "rounded-full bg-indigo-700 px-2 py-0.5 text-[10px] font-bold text-white";
const youtubeCountBadgeClassName =
  "rounded-full bg-rose-700 px-2 py-0.5 text-[10px] font-bold text-white";
const telegramCountBadgeClassName =
  "rounded-full bg-sky-700 px-2 py-0.5 text-[10px] font-bold text-white";
const tiktokCountBadgeClassName =
  "rounded-full bg-[#201A2B] px-2 py-0.5 text-[10px] font-bold text-white";

export function ProfileHeroCard({
  name,
  username,
  pincode,
  state,
  country,
  industry,
  category,
  instagramEngagementRateScore,
  profilePictureUrl,
  personalWebsite,
  emailForContact,
  userCanOpenLinks,
  emailVisible,
  socialLinks,
  onWebsiteOpen,
  onEmailOpen,
  onShareProfile,
  onSocialOpen,
  isSaved,
  saveLoading,
  onToggleSave,
  getProxiedImageUrl,
}: ProfileHeroCardProps) {
  const formatCount = (value?: number) =>
    typeof value === "number" && value > 0
      ? new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : null;

  const formattedInstagramEngagementRateScore =
    typeof instagramEngagementRateScore === "number" &&
    Number.isFinite(instagramEngagementRateScore)
      ? new Intl.NumberFormat("en", {
          maximumFractionDigits: 2,
        }).format(instagramEngagementRateScore)
      : null;

  const hasSocial =
    socialLinks.instagram ||
    socialLinks.linkedin ||
    socialLinks.twitter ||
    socialLinks.facebook ||
    socialLinks.youtube ||
    socialLinks.tiktok ||
    socialLinks.telegram;

  return (
    <div className="relative flex flex-col gap-6 rounded-[24px] border border-[#E7E1D6] bg-white p-6 sm:p-8 shadow-sm sm:flex-row sm:items-start">
      {/* Save and Share Top Right Actions */}
      <div className="absolute right-5 top-5 inline-flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSave}
          disabled={saveLoading}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed ${
            isSaved
              ? "border-[#1F9D6B]/30 bg-[#1F9D6B]/10 text-[#1F9D6B]"
              : "border-[#E7E1D6] bg-white text-[#201A2B] hover:bg-[#FAF8F5]"
          }`}
        >
          <FaBookmark className="h-3 w-3" />
          {saveLoading ? "..." : isSaved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={onShareProfile}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-white px-3 py-1.5 text-xs font-bold text-[#201A2B] transition hover:bg-[#FAF8F5]"
        >
          <FaShareNodes className="h-3 w-3 text-[#7A7286]" />
          Share
        </button>
      </div>

      {/* Profile Image / Avatar */}
      <div className="shrink-0 pt-1">
        {profilePictureUrl ? (
          <img
            src={getProxiedImageUrl(profilePictureUrl)}
            alt={`${name} avatar`}
            loading="lazy"
            decoding="async"
            className="h-28 w-28 rounded-[20px] object-cover ring-1 ring-[#E7E1D6] shadow-xs"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#FF5A36] to-[#6C4BFF] text-3xl font-extrabold font-heading text-white ring-1 ring-[#E7E1D6] shadow-xs">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1 space-y-3.5 pt-1">
        <div>
          <h1 className="text-2xl font-extrabold font-heading tracking-tight text-[#201A2B] sm:text-3xl">
            {name}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#6C4BFF]/20 bg-[#6C4BFF]/10 px-3 py-1 text-xs font-mono-code font-bold text-[#6C4BFF]">
              @{username}
            </span>
            {industry ? (
              <span className="inline-flex items-center rounded-full border border-[#1F9D6B]/20 bg-[#1F9D6B]/10 px-3 py-1 text-xs font-bold text-[#1F9D6B]">
                {industry}
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full border border-[#FF5A36]/20 bg-[#FF5A36]/10 px-3 py-1 text-xs font-bold text-[#FF5A36]">
              {getDisplayCategory(category)}
            </span>
            {formattedInstagramEngagementRateScore ? (
              <span className="inline-flex items-center rounded-full border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-1 text-xs font-mono-code font-bold text-[#201A2B]">
                ⚡ {formattedInstagramEngagementRateScore}% ER
              </span>
            ) : null}
          </div>
        </div>

        {/* Location Info */}
        {(() => {
          const isUnknownState = !state || state === "Unknown state" || state === "-";
          const isUnknownCountry = !country || country === "Unknown country" || country === "-";
          const parts = [
            !isUnknownState ? state : null,
            !isUnknownCountry ? country : null,
            pincode ? `PIN: ${pincode}` : null,
          ].filter(Boolean);
          const displayLocation = parts.join(", ");
          return displayLocation ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E1D6] bg-[#FAF8F5] px-3 py-1 text-xs font-medium text-[#7A7286]">
              <FaLocationDot className="text-[#FF5A36]" />
              {displayLocation}
            </div>
          ) : null;
        })()}

        {/* Website & Email quick access cards */}
        {(personalWebsite || emailForContact) ? (
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {personalWebsite ? (
              <button
                type="button"
                onClick={() => onWebsiteOpen(personalWebsite)}
                className="group cursor-pointer rounded-2xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-left transition hover:border-[#6C4BFF]/40 hover:bg-[#F1ECFF]/30 shadow-2xs"
              >
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#6C4BFF]">
                  <FaGlobe />
                  Creator Website
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p
                    className={`truncate text-xs font-semibold ${
                      userCanOpenLinks
                        ? "text-[#201A2B]"
                        : "select-none text-[#7A7286] blur-xs"
                    }`}
                  >
                    {personalWebsite}
                  </p>
                  {userCanOpenLinks ? (
                    <span className="shrink-0 text-[#7A7286] transition group-hover:text-[#6C4BFF]">
                      <FaArrowUpRightFromSquare className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="shrink-0 text-[#7A7286]">
                      <FaEyeSlash className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            ) : null}

            {emailForContact ? (
              <button
                type="button"
                onClick={() => onEmailOpen(`mailto:${emailForContact}`)}
                className="group cursor-pointer rounded-2xl border border-[#E7E1D6] bg-[#FAF8F5] p-3 text-left transition hover:border-[#FF5A36]/40 hover:bg-[#FFEAE3]/30 shadow-2xs"
              >
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono-code uppercase tracking-wider text-[#FF5A36]">
                  <FaEnvelope />
                  Direct Email
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-[#201A2B]">
                    {emailVisible ? emailForContact : "Unlock Email"}
                  </p>
                  {emailVisible ? (
                    <span className="shrink-0 text-[#7A7286] transition group-hover:text-[#FF5A36]">
                      <FaArrowUpRightFromSquare className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="shrink-0 text-[#7A7286]">
                      <FaEyeSlash className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Social Links */}
        <div className="pt-2">
          {hasSocial ? (
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.instagram && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://instagram.com/${socialLinks.instagram}`)
                  }
                  className={instagramButtonClassName}
                >
                  <FaInstagram /> Instagram
                  {formatCount(socialLinks.instagramFollowers) ? (
                    <span className={instagramCountBadgeClassName}>
                      {formatCount(socialLinks.instagramFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.youtube && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://youtube.com/${socialLinks.youtube}`)
                  }
                  className={youtubeButtonClassName}
                >
                  <FaYoutube /> YouTube
                  {formatCount(socialLinks.youtubeSubscribers) ? (
                    <span className={youtubeCountBadgeClassName}>
                      {formatCount(socialLinks.youtubeSubscribers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.linkedin && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://linkedin.com/in/${socialLinks.linkedin}`)
                  }
                  className={linkedinButtonClassName}
                >
                  <FaLinkedin /> LinkedIn
                  {formatCount(socialLinks.linkedinFollowers) ? (
                    <span className={linkedinCountBadgeClassName}>
                      {formatCount(socialLinks.linkedinFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.twitter && (
                <button
                  type="button"
                  onClick={() => onSocialOpen(`https://x.com/${socialLinks.twitter}`)}
                  className={twitterButtonClassName}
                >
                  <FaXTwitter /> Twitter
                  {formatCount(socialLinks.twitterFollowers) ? (
                    <span className={twitterCountBadgeClassName}>
                      {formatCount(socialLinks.twitterFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.facebook && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://facebook.com/${socialLinks.facebook}`)
                  }
                  className={facebookButtonClassName}
                >
                  <FaFacebook /> Facebook
                  {formatCount(socialLinks.facebookFollowers) ? (
                    <span className={facebookCountBadgeClassName}>
                      {formatCount(socialLinks.facebookFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.telegram && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://t.me/${socialLinks.telegram?.replace(/^@/, "")}`)
                  }
                  className={telegramButtonClassName}
                >
                  <FaTelegram /> Telegram
                  {formatCount(socialLinks.telegramFollowers) ? (
                    <span className={telegramCountBadgeClassName}>
                      {formatCount(socialLinks.telegramFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
              {socialLinks.tiktok && (
                <button
                  type="button"
                  onClick={() =>
                    onSocialOpen(`https://tiktok.com/@${socialLinks.tiktok}`)
                  }
                  className={tiktokButtonClassName}
                >
                  <FaTiktok /> TikTok
                  {formatCount(socialLinks.tiktokFollowers) ? (
                    <span className={tiktokCountBadgeClassName}>
                      {formatCount(socialLinks.tiktokFollowers)}
                    </span>
                  ) : null}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#7A7286]">No social channels connected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
