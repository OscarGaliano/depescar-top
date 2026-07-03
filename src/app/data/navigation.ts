export const NAV_ITEMS = [
  {
    label: "Pesca Submarina",
    sub: [
      { label: "Fusiles", href: "/tienda?seccion=fusiles" },
      { label: "Recambios de fusil", href: "/tienda?seccion=recambios-fusil" },
      { label: "Trajes y neopreno", href: "/tienda?seccion=trajes" },
      { label: "Máscaras y tubos", href: "/tienda?seccion=mascaras" },
      { label: "Aletas y calzantes", href: "/tienda?seccion=aletas" },
      { label: "Boyas y seguridad", href: "/tienda?seccion=boyas" },
      { label: "Lastre y plomos", href: "/tienda?seccion=lastre" },
      { label: "Ordenadores de apnea", href: "/tienda?seccion=ordenadores" },
    ],
  },
  {
    label: "Zona Rápida",
    sub: [
      { label: "Entrega inmediata", href: "/tienda?seccion=entrega-inmediata" },
      { label: "Outlet y ofertas", href: "/tienda?seccion=outlet" },
      { label: "Ver todo el catálogo", href: "/tienda" },
    ],
  },
  { label: "Academia", sub: [{ label: "Cursos Online", href: "/tienda" }, { label: "Academia Málaga", href: "/tienda" }, { label: "Zona de Alumnos", href: "/tienda" }] },
  { label: "Guías", sub: [{ label: "Planificar Jornada", href: "/tienda" }, { label: "Pesca Submarina", href: "/tienda" }, { label: "Pesca Kayak", href: "/tienda" }, { label: "Pesca Surfcasting", href: "/tienda" }] },
  {
    label: "Marcas",
    sub: ["Picasso", "C4 Carbon", "SEAC", "Salvimar", "Rob Allen", "H.Dessault", "Pathos", "Beuchat"].map((brand) => ({
      label: brand,
      href: `/tienda?q=${encodeURIComponent(brand)}`,
    })),
  },
];

export const REVIEWS = [
  { id: 1, name: "Carlos G.", avatar: "CG", rating: 5, product: "Paulasub Tensor", text: "Calidad impresionante y envío en 24h. Ya llevo tres compras en depescar y siempre me superan las expectativas." },
  { id: 2, name: "Francisco Gutiérrez", avatar: "FG", rating: 5, product: "Picasso Llama Peces", text: "Un trato como siempre de maravilla. Atención personalizada y el producto llegó perfectamente embalado." },
  { id: 3, name: "David López", avatar: "DL", rating: 5, product: "Seac Snake", text: "Perfecto y muy guapo. Calidad premium al mejor precio. La atención post-venta también es excelente." },
  { id: 4, name: "Héctor I.", avatar: "HI", rating: 5, product: "Picasso Boom Circular", text: "Gran potencia y fácil de cargar. Exactamente lo que buscaba. Depescar siempre cumple sus promesas." },
];

export const TRUST = [
  { icon: "Truck", title: "Envío desde 2€", desc: "A toda España · 24-48h" },
  { icon: "Shield", title: "Pago 100% Seguro", desc: "Cifrado SSL · Bizum · PayPal" },
  { icon: "Award", title: "Distribuidores Oficiales", desc: "Garantía de marca incluida" },
  { icon: "Package", title: "Devolución 30 días", desc: "Sin preguntas ni complicaciones" },
];
