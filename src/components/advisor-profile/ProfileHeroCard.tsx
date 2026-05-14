import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  instagramFollowers?: number;
  linkedinFollowers?: number;
  twitterFollowers?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
};

type ProfileHeroCardProps = {
  name: string;
  username: string;
  state: string;
  country: string;
  industry?: string;
  profilePictureUrl?: string;
  socialLinks: SocialLinks;
  onSocialOpen: (url: string) => void;
  getProxiedImageUrl: (url: string) => string;
};

const socialButtonBaseClassName =
  "inline-flex min-w-[150px] items-center justify-center gap-1.5 rounded-full border p-2 text-xs font-semibold transition";
const instagramButtonClassName =
  `${socialButtonBaseClassName} border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100`;
const linkedinButtonClassName =
  `${socialButtonBaseClassName} border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100`;
const twitterButtonClassName =
  `${socialButtonBaseClassName} border-black bg-black text-white hover:bg-zinc-900`;
const facebookButtonClassName =
  `${socialButtonBaseClassName} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100`;
const youtubeButtonClassName =
  `${socialButtonBaseClassName} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`;
const tiktokButtonClassName =
  `${socialButtonBaseClassName} border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200`;
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
const tiktokCountBadgeClassName =
  "rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-white";

export function ProfileHeroCard({
  name,
  username,
  state,
  country,
  industry,
  profilePictureUrl,
  socialLinks,
  onSocialOpen,
  getProxiedImageUrl,
}: ProfileHeroCardProps) {
  const formatCount = (value?: number) =>
    typeof value === "number" && value > 0
      ? new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : null;

  const hasSocial =
    socialLinks.instagram ||
    socialLinks.linkedin ||
    socialLinks.twitter ||
    socialLinks.facebook ||
    socialLinks.youtube ||
    socialLinks.tiktok;

  return (
    <div className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-start">
      <div className="shrink-0">
        {profilePictureUrl ? (
          <img
            src={getProxiedImageUrl(profilePictureUrl)}
            alt={`${name} avatar`}
            loading="lazy"
            decoding="async"
            className="h-28 w-28 rounded-3xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-linear-to-br from-blue-700 to-cyan-500 text-3xl font-semibold text-white ring-1 ring-slate-200">
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-x-2">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="inline-flex items-center rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-xs font-semibold tracking-wide text-white">
            @{username}
          </p>
          {industry ? (
            <p className="inline-flex items-center rounded-full bg-green-700 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              Industry: {industry}
            </p>
          ) : null}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          <FaLocationDot className="text-blue-600" />
          {state}, {country}
        </div>

        <div className="mt-5">
          {hasSocial ? (
            <div className="mt-3 flex flex-wrap gap-3">
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
                      {formatCount(socialLinks.instagramFollowers)} followers
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
                      {formatCount(socialLinks.linkedinFollowers)} followers
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
                      {formatCount(socialLinks.twitterFollowers)} followers
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
                      {formatCount(socialLinks.facebookFollowers)} followers
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
                      {formatCount(socialLinks.youtubeSubscribers)} subscribers
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
                      {formatCount(socialLinks.tiktokFollowers)} followers
                    </span>
                  ) : null}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No social links available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
