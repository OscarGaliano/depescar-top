import { Link } from "react-router";
import { MapPin, Mail, Instagram, Facebook, Youtube, Fish } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
                <Fish className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">de<span className="text-primary">pescar</span>.top</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Tu tienda especializada en pesca submarina desde Málaga. Equipo premium, asesoramiento experto y envíos rápidos a toda España.
            </p>
            <div className="space-y-2 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Málaga, España</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" /> hola@depescar.top</div>
            </div>
            <div className="flex items-center gap-2">
              {([Instagram, Facebook, Youtube] as const).map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={["Instagram", "Facebook", "Youtube"][i]}
                  className="w-9 h-9 border border-border rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Tienda", links: ["Fusiles de Pesca", "Trajes Pescasub", "Máscaras y Tubos", "Aletas", "Zona Outlet", "Combos y Kits"] },
            { title: "Academia", links: ["Cursos Online", "Academia Málaga", "Zona de Alumnos", "Guías de Pesca", "Blog Pescasub"] },
            { title: "Ayuda", links: ["Preguntas Frecuentes", "Seguimiento de Pedidos", "Devoluciones", "Contacto", "Sobre Nosotros"] },
          ].map(col => (
            <nav key={col.title} aria-label={`Sección ${col.title}`}>
              <h3 className="font-semibold text-foreground mb-4 text-[11px] uppercase tracking-[0.15em] font-mono">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <Link to="/tienda" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 depescar.top · Todos los derechos reservados · Málaga, España
          </p>
          <nav className="flex items-center gap-4 flex-wrap justify-center" aria-label="Legal">
            {["Aviso Legal", "Privacidad", "Cookies", "Términos"].map(link => (
              <a key={link} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
