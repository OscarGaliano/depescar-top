import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle, Package, ArrowRight, Fish } from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order") ?? "DP-XXXXXX";

  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#00c8d7", "#c8a84a", "#e4ecf5"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#00c8d7", "#c8a84a", "#e4ecf5"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
          ¡Pedido confirmado!
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Gracias por tu compra en depescar.top. Recibirás un email de confirmación con los detalles de tu pedido.
        </p>

        <div className="bg-card border border-border rounded-sm p-5 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Fish className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Número de pedido</span>
          </div>
          <div className="text-2xl font-bold font-mono text-primary">{orderId}</div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Package className="w-4 h-4" />
            Envío estimado: 24-48 horas
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Seguir comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-8 py-3.5 rounded-sm hover:border-primary hover:text-primary transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
