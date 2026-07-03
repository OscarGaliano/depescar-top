import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Fish, ArrowRight } from "lucide-react";
import { Command } from "cmdk";
import { Dialog, DialogContent } from "../ui/dialog";
import { useShop } from "../../context/ShopContext";
import { PRODUCTS } from "../../data/products";
import { CATALOG_SECTIONS } from "../../data/sections";

export function SearchCommand() {
  const { searchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const filtered = query
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.cat.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 6);

  const go = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="p-0 gap-0 max-w-lg bg-card border-border overflow-hidden">
        <Command className="bg-transparent" shouldFilter={false}>
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar fusiles, trajes, máscaras..."
              className="flex-1 bg-transparent border-0 outline-none px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] border border-border px-1.5 py-0.5 rounded font-mono text-muted-foreground hidden sm:inline">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No se encontraron productos
            </Command.Empty>

            {!query && (
              <Command.Group heading="Secciones" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                {CATALOG_SECTIONS.slice(0, 6).map(section => (
                  <Command.Item
                    key={section.slug}
                    value={section.full}
                    onSelect={() => go(`/tienda?seccion=${section.slug}`)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <Fish className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{section.name}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground font-mono">{section.productCount}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading={query ? "Resultados" : "Productos destacados"} className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {filtered.map(p => (
                <Command.Item
                  key={p.id}
                  value={p.name}
                  onSelect={() => go(`/producto/${p.slug}`)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-pointer data-[selected=true]:bg-primary/10"
                >
                  <img src={p.img} alt="" className="w-10 h-10 object-cover rounded-sm bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{p.brand} · {p.cat}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold font-mono text-primary">€{p.sale}</div>
                    <div className="text-[10px] text-muted-foreground line-through font-mono">€{p.orig}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            {query && filtered.length > 0 && (
              <Command.Item
                value="ver-todos"
                onSelect={() => go(`/tienda?q=${encodeURIComponent(query)}`)}
                className="flex items-center justify-center gap-2 px-3 py-3 mt-1 rounded-sm cursor-pointer text-sm text-primary font-medium data-[selected=true]:bg-primary/10"
              >
                Ver todos los resultados
                <ArrowRight className="w-4 h-4" />
              </Command.Item>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
