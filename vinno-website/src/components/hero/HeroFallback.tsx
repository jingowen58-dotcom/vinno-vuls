export function HeroFallback() {
  return (
    <svg viewBox="0 0 640 640" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="globe" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#16344c" />
          <stop offset="70%" stopColor="#0d2236" />
          <stop offset="100%" stopColor="#07111f" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="320" r="168" fill="url(#globe)" stroke="#46C8E8" strokeOpacity="0.35" />
      <ellipse cx="320" cy="320" rx="168" ry="64" fill="none" stroke="#7A9FE8" strokeOpacity="0.35" />
      <ellipse cx="320" cy="320" rx="64" ry="168" fill="none" stroke="#46C8E8" strokeOpacity="0.28" />
      <ellipse cx="320" cy="320" rx="120" ry="168" fill="none" stroke="#67E0D1" strokeOpacity="0.2" />
      <path className="flow-line" d="M120 180 C220 140, 260 210, 320 200" fill="none" stroke="#46C8E8" strokeWidth="1.2" />
      <path className="flow-line" d="M500 150 C430 210, 470 250, 430 300" fill="none" stroke="#67E0D1" strokeWidth="1.2" />
      <path className="flow-line" d="M150 460 C230 420, 250 470, 310 450" fill="none" stroke="#7A9FE8" strokeWidth="1.2" />
      {[
        [210, 250],
        [390, 230],
        [450, 340],
        [250, 400],
        [340, 180],
        [300, 360],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="3" fill="#67E0D1" />
          <circle cx={x} cy={y} r="8" fill="none" stroke="#46C8E8" strokeOpacity="0.45" />
        </g>
      ))}
      <path d="M520 250c18-18 18-36 0-54s-18-36 0-54" fill="none" stroke="#46C8E8" strokeOpacity="0.55" />
      <path d="M536 250c18-18 18-36 0-54s-18-36 0-54" fill="none" stroke="#67E0D1" strokeOpacity="0.4" />
    </svg>
  );
}
