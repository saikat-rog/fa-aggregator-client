import { useState, useRef, useEffect } from "react";
import { FaShareNodes, FaXTwitter, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaTelegram, FaLink, FaCheck } from "react-icons/fa6";

type Props = {
  url: string;
  title: string;
  className?: string;
};

export function SocialShareButtons({ url, title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const sharePlatforms = [
    {
      name: "Twitter / X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-slate-100 text-slate-800",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-50 text-blue-700",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-50 text-blue-800",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-emerald-50 text-emerald-700",
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-50 text-sky-600",
    },
  ];

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore fallback
    }
  };

  const handleShareClick = async () => {
    // 1. Copy link automatically when clicking share
    await copyToClipboard();

    // 2. Try native web share if supported
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User closed native menu or not supported, fallback to custom menu below
      }
    }

    // 3. Toggle options dropdown
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} ref={dropdownRef}>
      {/* Primary Share Button (copies link & opens options) */}
      <button
        type="button"
        onClick={() => void handleShareClick()}
        title="Share resource"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-95"
      >
        <FaShareNodes className="h-3.5 w-3.5 text-blue-400" />
        Share
      </button>

      {/* Direct Copy Link Button */}
      <button
        type="button"
        onClick={() => void copyToClipboard()}
        title="Copy direct link to clipboard"
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
          copied
            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        {copied ? (
          <>
            <FaCheck className="h-3.5 w-3.5 text-emerald-600" />
            Link Copied!
          </>
        ) : (
          <>
            <FaLink className="h-3.5 w-3.5 text-slate-500" />
            Copy Link
          </>
        )}
      </button>

      {/* Floating feedback toast */}
      {copied ? (
        <span className="absolute -top-9 right-0 z-10 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          Link copied to clipboard!
        </span>
      ) : null}

      {/* Dropdown Options for Social Media Platforms */}
      {showOptions ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Share To Socials
          </p>
          <div className="space-y-1">
            {sharePlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowOptions(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition ${platform.color}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {platform.name}
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
