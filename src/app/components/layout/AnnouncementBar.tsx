import { useState, useEffect } from "react";
import { Truck } from "lucide-react";

const MESSAGES = [
  "Envíos a España desde 2€ · 24-48h",
  "Academia Online disponible",
  "Devoluciones 30 días gratis",
  "Envío gratis en pedidos +75€",
  "Distribuidores oficiales de las mejores marcas",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs font-medium tracking-wide">
      <span className={`inline-flex items-center gap-1.5 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
        <Truck className="w-3 h-3" />
        {MESSAGES[index]}
      </span>
    </div>
  );
}
