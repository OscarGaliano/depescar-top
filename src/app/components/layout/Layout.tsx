import { Outlet } from "react-router";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../shop/CartDrawer";
import { SearchCommand } from "../shop/SearchCommand";
import { QuickView } from "../shop/QuickView";
import { BackToTop } from "../effects/BackToTop";

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchCommand />
      <QuickView />
      <BackToTop />
    </div>
  );
}
