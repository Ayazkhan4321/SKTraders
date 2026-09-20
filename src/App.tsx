import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Admin CMS Context, Layout & Pages
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import HeroManagement from './admin/pages/HeroManagement';
import HeroCardsManagement from './admin/pages/HeroCardsManagement';
import CertificatesManagement from './admin/pages/CertificatesManagement';
import BrandLogosManagement from './admin/pages/BrandLogosManagement';
import LeadingBrandsManagement from './admin/pages/LeadingBrandsManagement';
import ApplicationsManagement from './admin/pages/ApplicationsManagement';
import FeaturePagesManagement from './admin/pages/FeaturePagesManagement';
import FeaturePageEditor from './admin/pages/FeaturePageEditor';
import { AdminProductsManagement } from './admin/pages/AdminProductsManagement';
import { AdminProductEditor } from './admin/pages/AdminProductEditor';
import { AdminCategoriesManagement } from './admin/pages/AdminCategoriesManagement';
import { AdminHomepageProductsManagement } from './admin/pages/AdminHomepageProductsManagement';
import { AdminHomepageProductEditor } from './admin/pages/AdminHomepageProductEditor';
import ProductSearchSection from './components/ProductSearchSection';
import CircularSolutionsCarousel from './components/CircularSolutionsCarousel';
// Public Website Pages & Components
import FeatureDetailPage from './pages/FeatureDetailPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionResources from './components/SectionResources';
import SectionBrandGrid from './components/SectionBrandGrid';
import SectionLeadingBrands from './components/SectionLeadingBrands';
import SectionHighlightsCarousel from './components/SectionHighlightsCarousel';
import SectionProfessionalOfferings from './components/SectionProfessionalOfferings';
import Section03InteractiveRoom from './components/Section03InteractiveRoom';
import Section05FeaturedProducts from './components/Section05FeaturedProducts';
import Section07Projects from './components/Section07Projects';
import Section10Contact from './components/Section10Contact';
import Footer from './components/Footer';
import FloatingContactButtons from './components/FloatingContactButtons';
import CustomCursor from './components/CustomCursor';
import SEOHead from './components/SEOHead';
import Lenis from 'lenis';

// Modals
import QuoteModal from './components/QuoteModal';
import CatalogueModal from './components/CatalogueModal';
import AuthModal from './components/AuthModal';
import { CatalogueItem } from './lib/supabase';

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');

  const handleOpenQuote = (productName?: string) => {
    setSelectedQuoteProduct(productName || '');
    setQuoteModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00e676] selection:text-slate-950">
      <Navbar onOpenQuote={() => handleOpenQuote()} />
      {children}
      <Footer />
      <FloatingContactButtons />
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={selectedQuoteProduct}
      />
    </div>
  );
}

function PublicWebsite() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState<string>('');
  const [catalogueModalItem, setCatalogueModalItem] = useState<CatalogueItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isAdmin?: boolean;
  } | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('section, .reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sk_user_session');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          // ignore
        }
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  const handleUserLoginSuccess = (user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    isAdmin: boolean;
  }) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sk_user_session', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sk_user_session');
    }
  };

  const handleOpenQuote = (productName?: string) => {
    if (productName) {
      setSelectedQuoteProduct(productName);
    } else {
      setSelectedQuoteProduct('');
    }
    setQuoteModalOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-white text-slate-900 overflow-hidden selection:bg-[#00e676] selection:text-black font-sans">
      <SEOHead
        title="SK Traders | Authorized Philips Lighting Distributor"
        description="Authorized distributor of authentic Philips Lighting products in Hyderabad. Supplying LED lights, commercial fixtures, and smart BLDC fans."
        canonicalPath="/"
        keywords="SK Traders, Philips Lighting Hyderabad, Authorized Philips Distributor, Signify Lighting, COB Downlights, BLDC Fans Hyderabad"
      />
      <Navbar
        onOpenQuote={() => handleOpenQuote()}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <Hero onOpenQuote={() => handleOpenQuote()} />
      <ProductSearchSection />
      <SectionResources onOpenQuote={() => handleOpenQuote()} />
      <CircularSolutionsCarousel onOpenQuote={() => handleOpenQuote} />

      <SectionBrandGrid onOpenQuote={() => handleOpenQuote()} />

      <SectionLeadingBrands onOpenQuote={() => handleOpenQuote()} />

      <SectionHighlightsCarousel onOpenQuote={() => handleOpenQuote()} />

      <SectionProfessionalOfferings onOpenQuote={() => handleOpenQuote()} />

      <Section03InteractiveRoom />

      <Section05FeaturedProducts onOpenQuote={handleOpenQuote} />

      <Section07Projects onOpenQuote={() => handleOpenQuote()} />

      <Section10Contact onOpenQuote={() => handleOpenQuote()} />

      <Footer />

      <FloatingContactButtons />

      <CustomCursor />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProductName={selectedQuoteProduct}
      />

      <CatalogueModal
        catalogue={catalogueModalItem}
        onClose={() => setCatalogueModalItem(null)}
        onOpenPayment={(title) => handleOpenQuote(title)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessLogin={handleUserLoginSuccess}
      />
    </main>
  );
}

const CATEGORY_SLUGS = [
  'ceiling-lights',
  'led-bulbs',
  'panel-lights',
  'downlights',
  'spotlights',
  'decorative-lights',
  'smart-lighting',
  'fans',
  'indoor-lighting',
  'outdoor-lighting',
  'commercial-lighting',
  'all',
];

function ProductOrCategoryResolver() {
  const { category: slugOrCategory } = useParams<{ category?: string }>();
  if (!slugOrCategory) return <ProductsPage />;
  if (CATEGORY_SLUGS.includes(slugOrCategory.toLowerCase())) {
    return <ProductsPage />;
  }
  return <ProductDetailPage />;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Main Route */}
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/features/:slug" element={<FeatureDetailPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:slug" element={<ApplicationDetailPage />} />
          {/* Product Catalogue Routes */}
          <Route
            path="/products"
            element={
              <PublicLayout>
                <ProductsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/products/:category"
            element={
              <PublicLayout>
                <ProductOrCategoryResolver />
              </PublicLayout>
            }
          />
          <Route
            path="/products/detail/:slug"
            element={
              <PublicLayout>
                <ProductDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/lighting/:categorySlug"
            element={
              <PublicLayout>
                <CategoryPage />
              </PublicLayout>
            }
          />

          {/* Admin Login Route */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin CMS Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProductsManagement />} />
            <Route path="products/new" element={<AdminProductEditor />} />
            <Route path="products/edit/:id" element={<AdminProductEditor />} />
            <Route path="categories" element={<AdminCategoriesManagement />} />
            <Route path="homepage-products" element={<AdminHomepageProductsManagement />} />
            <Route path="homepage-products/new" element={<AdminHomepageProductEditor />} />
            <Route path="homepage-products/edit/:id" element={<AdminHomepageProductEditor />} />
            <Route path="hero" element={<HeroManagement />} />
            <Route path="hero-cards" element={<HeroCardsManagement />} />
            <Route path="features" element={<FeaturePagesManagement />} />
            <Route path="features/new" element={<FeaturePageEditor />} />
            <Route path="features/edit/:id" element={<FeaturePageEditor />} />
            <Route path="brands" element={<LeadingBrandsManagement />} />
            <Route path="applications" element={<ApplicationsManagement />} />
            <Route path="certificates" element={<CertificatesManagement />} />
            <Route path="footer-brands" element={<BrandLogosManagement />} />
          </Route>

          {/* Catch-all redirect to Admin or Public */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
