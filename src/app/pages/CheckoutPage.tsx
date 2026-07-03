import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import {
  ChevronLeft, CreditCard, Lock, Truck, Check, Minus, Plus, Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useShop } from "../context/ShopContext";

type Step = "shipping" | "payment" | "review";

export function CheckoutPage() {
  const { cart, cartSubtotal, shippingCost, cartTotal, hasFreeShipping, updateQuantity, removeFromCart, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("shipping");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", postalCode: "", phone: "",
    paymentMethod: "card" as "card" | "paypal" | "bizum",
    cardNumber: "", cardExpiry: "", cardCvc: "",
  });

  if (cart.length === 0) return <Navigate to="/tienda" replace />;

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Envío" },
    { key: "payment", label: "Pago" },
    { key: "review", label: "Confirmar" },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  const canProceedShipping = form.email && form.firstName && form.lastName && form.address && form.city && form.postalCode && form.phone;
  const canProceedPayment = form.paymentMethod !== "card" || (form.cardNumber && form.cardExpiry && form.cardCvc);

  const handleSubmit = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    const orderId = `DP-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    navigate(`/pedido-confirmado?order=${orderId}`);
  };

  return (
    <div className="py-8 px-4 lg:px-8 min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <Link to="/tienda" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Seguir comprando
        </Link>

        <div className="flex items-center gap-2 mb-8">
          <Lock className="w-4 h-4 text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Checkout Seguro</h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold transition-colors ${
                i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === "shipping" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Datos de envío</h2>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" placeholder="tu@email.com" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Nombre</label>
                    <input value={form.firstName} onChange={e => update("firstName", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Apellidos</label>
                    <input value={form.lastName} onChange={e => update("lastName", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Dirección</label>
                  <input value={form.address} onChange={e => update("address", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" placeholder="Calle, número, piso..." />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Ciudad</label>
                    <input value={form.city} onChange={e => update("city", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Código Postal</label>
                    <input value={form.postalCode} onChange={e => update("postalCode", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm" placeholder="+34 600 000 000" />
                </div>
                <button
                  onClick={() => setStep("payment")}
                  disabled={!canProceedShipping}
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50 mt-4"
                >
                  Continuar al pago
                </button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Método de pago</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {(["card", "paypal", "bizum"] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => update("paymentMethod", method)}
                      className={`p-4 border rounded-sm text-center transition-all ${
                        form.paymentMethod === method ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-mono uppercase">{method === "card" ? "Tarjeta" : method === "paypal" ? "PayPal" : "Bizum"}</span>
                    </button>
                  ))}
                </div>

                {form.paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Número de tarjeta</label>
                      <input value={form.cardNumber} onChange={e => update("cardNumber", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm font-mono" placeholder="4242 4242 4242 4242" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">Caducidad</label>
                        <input value={form.cardExpiry} onChange={e => update("cardExpiry", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm font-mono" placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div>
                        <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">CVC</label>
                        <input value={form.cardCvc} onChange={e => update("cardCvc", e.target.value)} className="w-full bg-card border border-border px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm font-mono" placeholder="123" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep("shipping")} className="px-6 py-3 border border-border rounded-sm text-sm hover:border-primary/40 transition-colors">
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    disabled={!canProceedPayment}
                    className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    Revisar pedido
                  </button>
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Confirmar pedido</h2>
                <div className="bg-card border border-border rounded-sm p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Envío a:</span> {form.firstName} {form.lastName}</p>
                  <p><span className="text-muted-foreground">Dirección:</span> {form.address}, {form.postalCode} {form.city}</p>
                  <p><span className="text-muted-foreground">Email:</span> {form.email}</p>
                  <p><span className="text-muted-foreground">Pago:</span> {form.paymentMethod === "card" ? "Tarjeta" : form.paymentMethod === "paypal" ? "PayPal" : "Bizum"}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setStep("payment")} className="px-6 py-3 border border-border rounded-sm text-sm hover:border-primary/40 transition-colors">
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-sm hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>Confirmar y pagar €{cartTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-sm p-5 sticky top-28">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Resumen del pedido
              </h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <img src={item.product.img} alt="" className="w-14 h-14 object-cover rounded-sm bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{item.size ? `Talla ${item.size}` : ""}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 border border-border rounded-sm">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)} className="w-6 h-6 flex items-center justify-center"><Minus className="w-2.5 h-2.5" /></button>
                          <span className="w-6 text-center text-xs font-mono">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)} className="w-6 h-6 flex items-center justify-center"><Plus className="w-2.5 h-2.5" /></button>
                        </div>
                        <span className="text-sm font-mono font-bold">€{(item.product.sale * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.size)} className="text-muted-foreground hover:text-destructive self-start">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">€{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className={`font-mono ${hasFreeShipping ? "text-primary" : ""}`}>
                    {hasFreeShipping ? "Gratis" : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono text-primary">€{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
