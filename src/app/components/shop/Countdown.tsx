import { useState, useEffect } from "react";

export function Countdown({ secs }: { secs: number }) {
  const [t, setT] = useState(secs);
  useEffect(() => {
    const id = setInterval(() => setT(s => (s > 0 ? s - 1 : secs)), 1000);
    return () => clearInterval(id);
  }, [secs]);
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return (
    <div className="flex items-center gap-1.5" aria-label="Cuenta atrás de oferta">
      {([[h, "h"], [m, "m"], [s, "s"]] as [number, string][]).map(([val, label], i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 border border-primary/30 rounded-sm px-2.5 py-1.5 font-mono text-primary text-sm font-bold min-w-[40px] text-center tabular-nums">
              {pad(val)}
            </div>
            <span className="text-muted-foreground text-[9px] mt-0.5 uppercase tracking-widest">{label}</span>
          </div>
          {i < 2 && <span className="text-primary/60 font-bold text-lg mb-3">:</span>}
        </div>
      ))}
    </div>
  );
}
