import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagramFollowers?: number;
  linkedinFollowers?: number;
  twitterFollowers?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
};

type ProfileHeroCardProps = {
  name: string;
  username: string;
  state: string;
  country: string;
  profilePictureUrl?: string;
  socialLinks: SocialLinks;
  onSocialOpen: (url: string) => void;
  getProxiedImageUrl: (url: string) => string;
};

const socialButtonClassName =
  "inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100";

export function ProfileHeroCard({
  name,
  username,
  state,
  country,
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
    socialLinks.youtube;

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
        <p className="mt-3 inline-flex items-center rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-xs font-semibold tracking-wide text-white">
          @{username}
        </p>
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
                  className={socialButtonClassName}
                >
                  <FaInstagram /> Instagram
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.instagramFollowers)} followers */}
                      100K followers
                    </span>
                  {formatCount(socialLinks.instagramFollowers) ? (
                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.instagramFollowers)} followers */}
                      100K followers
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
                  className={socialButtonClassName}
                >
                  <FaLinkedin /> LinkedIn
                  
                </button>
              )}
              {socialLinks.twitter && (
                <button
                  type="button"
                  onClick={() => onSocialOpen(`https://x.com/${socialLinks.twitter}`)}
                  className={socialButtonClassName}
                >
                  <FaXTwitter /> Twitter
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.twitterFollowers)} followers */}
                      120K followers
                    </span>
                  {formatCount(socialLinks.twitterFollowers) ? (
                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.twitterFollowers)} followers */}
                      120K followers
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
                  className={socialButtonClassName}
                >
                  <FaFacebook /> Facebook
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.facebookFollowers)} followers */}
                      200K followers
                    </span>
                  {formatCount(socialLinks.facebookFollowers) ? (
                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.facebookFollowers)} followers */}
                      200K followers
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
                  className={socialButtonClassName}
                >
                  <FaYoutube /> YouTube
                  <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.youtubeSubscribers)} subscribers */}
                      20K subscribers
                    </span>
                  {formatCount(socialLinks.youtubeSubscribers) ? (
                    <span className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {/* {formatCount(socialLinks.youtubeSubscribers)} subscribers */}
                      20K subscribers
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
