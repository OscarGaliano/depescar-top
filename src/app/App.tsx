import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { ShopProvider } from "./context/ShopContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductPage } from "./pages/ProductPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tienda" element={<ShopPage />} />
            <Route path="producto/:slug" element={<ProductPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="pedido-confirmado" element={<OrderSuccessPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />
    </ShopProvider>
  );
}
