function unsplash(id: string, size = { w: 1400, h: 1750 }) {
  return `https://images.unsplash.com/photo-${id}?w=${size.w}&h=${size.h}&fit=crop&q=92&auto=format`;
}

export const IMG = {
  hero: unsplash("1682686580391-615b1f28e5ee", { w: 1920, h: 1080 }),
  diver1: unsplash("1682887523066-306db2a682f1"),
  diver2: unsplash("1682887523106-9d5d21707bde"),
  mask: "/images/categories/mascaras.png",
  speargun: "/images/categories/fusiles.png",
  fins: "https://upload.wikimedia.org/wikipedia/commons/2/26/Palmes_de_chasse_sous-marine_et_apn%C3%A9e_en_fibre_de_verre%2C_de_marque_Breier.jpg",
  wetsuit: "/images/categories/trajes.png",
  hunting: "https://images.pexels.com/photos/14322469/pexels-photo-14322469.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1750&fit=crop&dpr=2",
  ocean1: unsplash("1721057911005-203fc357ba22"),
  ocean2: unsplash("1682687980976-fec0915c6177", { w: 1600, h: 900 }),
  sunset: unsplash("1682686580391-615b1f28e5ee", { w: 1600, h: 800 }),
};
