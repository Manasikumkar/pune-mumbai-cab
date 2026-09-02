import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileStickyBar from "./MobileStickyBar";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col pb-14 md:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-800 focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
