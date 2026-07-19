const RAYON = 54;
const CIRCONFERENCE = 2 * Math.PI * RAYON;

export function TimerRing({ secondesRestantes, secondesTotal }: { secondesRestantes: number; secondesTotal: number }) {
  const progression = secondesTotal > 0 ? secondesRestantes / secondesTotal : 0;
  const minutes = Math.floor(secondesRestantes / 60);
  const secondes = secondesRestantes % 60;

  return (
    <div className="relative mx-auto h-32 w-32" role="timer" aria-label={`${minutes} minutes ${secondes} secondes restantes`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={RAYON} fill="none" stroke="#F3ECDF" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={RAYON}
          fill="none"
          stroke="url(#degrade-timer)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCONFERENCE}
          strokeDashoffset={CIRCONFERENCE * (1 - progression)}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
        <defs>
          <linearGradient id="degrade-timer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7F6B" />
            <stop offset="50%" stopColor="#FFD966" />
            <stop offset="100%" stopColor="#6FB8F0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-titre text-2xl font-bold" aria-hidden="true">
        {minutes}:{secondes.toString().padStart(2, "0")}
      </div>
    </div>
  );
}
