interface CreatorDot {
  id: string;
  angle: number;
  dot: number;
}

const MOCK_CREATOR_DOTS: CreatorDot[] = [
  { id: "c1", angle: 40, dot: 3 },
  { id: "c2", angle: 110, dot: 8 },
  { id: "c3", angle: 200, dot: 10 },
  { id: "c4", angle: 260, dot: 11 },
  { id: "c5", angle: 320, dot: 2 },
  { id: "c6", angle: 160, dot: 9 },
  { id: "c7", angle: 20, dot: 7 },
  { id: "c8", angle: 290, dot: 6 },
];

export function ReachRadar({
  size = 220,
  highlightIds = null,
  pulsing = true,
}: {
  size?: number;
  highlightIds?: string[] | null;
  pulsing?: boolean;
}) {
  const center = size / 2;
  const maxPx = center - 26;
  const violet = "#6C4BFF";
  const coral = "#FF5A36";
  const ink = "#201A2B";

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          height="100%"
          role="img"
          aria-label="Local reach signal"
        >
          <circle cx={center} cy={center} r={maxPx + 14} fill="#F1ECFF" />
          {pulsing && (
            <>
              <circle
                cx={center}
                cy={center}
                r={maxPx * 0.7}
                fill="none"
                stroke={violet}
                strokeWidth="1.5"
                opacity="0.5"
                className="pulse-ring"
              />
              <circle
                cx={center}
                cy={center}
                r={maxPx * 0.7}
                fill="none"
                stroke={violet}
                strokeWidth="1.5"
                opacity="0.5"
                className="pulse-ring pulse-ring-2"
              />
            </>
          )}
          {[0.33, 0.66, 1].map((f, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={maxPx * f}
              fill="none"
              stroke="#C9BCFF"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          ))}
          {MOCK_CREATOR_DOTS.map((c) => {
            const active = highlightIds ? highlightIds.includes(c.id) : true;
            const r = (c.dot / 12) * maxPx;
            const rad = (c.angle * Math.PI) / 180;
            const x = center + r * Math.cos(rad);
            const y = center + r * Math.sin(rad);
            return (
              <circle
                key={c.id}
                cx={x}
                cy={y}
                r={active ? 6 : 4.5}
                fill={active ? coral : "#B9AEDD"}
                stroke="#FAF8F5"
                strokeWidth="1.5"
              />
            );
          })}
          <circle cx={center} cy={center} r={7} fill={ink} />
          <circle cx={center} cy={center} r={3} fill="#FAF8F5" />
        </svg>
      </div>
      <div className="font-mono-code text-[12px] font-semibold text-[#5A3FE0] mt-2">
        In your neighborhood
      </div>
    </div>
  );
}
