import { useState } from "react";
import type { Page } from "@/app-types";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useAuthContext, useLogoutController } from "@/features/auth";
import { AuthPage } from "@/features/auth/pages/AuthPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { GlobalInboxDrawer } from "@/features/dashboard/components/GlobalInboxDrawer";
import { HomePageContainer } from "@/features/events/pages/HomePageContainer";
import { useNotificationContext } from "@/features/notifications";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ProtectedRoute } from "@/app/routes/ProtectedRoute";

type DashboardRouteContext = {
  realtimeFeed: string[];
  notificationsLoading: boolean;
  notificationsError: string;
  unreadNotificationsCount: number;
  dashboardNotificationItems: ReturnType<typeof useNotificationContext>["dashboardNotificationItems"];
  onOpenInbox: () => void;
  onLogout: () => void;
  onExplore: () => void;
  onMarkNotificationRead: (id: string) => void;
  onNotificationItemClick: (item: ReturnType<typeof useNotificationContext>["dashboardNotificationItems"][number]) => void;
};

const pathToPage: Record<string, Page> = {
  "/": "home",
  "/login": "login",
  "/signup": "signup",
  "/about": "about",
  "/contact": "contact",
  "/support": "support",
  "/dashboard": "dashboard"
};

const pageToPath: Record<Page, string> = {
  home: "/",
  login: "/login",
  signup: "/signup",
  about: "/about",
  contact: "/contact",
  support: "/support",
  dashboard: "/dashboard"
};

function PublicRoutePage({ page }: { page: Extract<Page, "home" | "about" | "contact" | "support"> }) {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuthContext();

  const handleCreateEvent = () => {
    if (isAuthenticated && profile && (profile.role === "Organizer" || profile.role === "Admin")) {
      navigate("/dashboard");
      return;
    }
    navigate("/signup");
  };

  return (
    <HomePageContainer
      page={page}
      isAuthenticated={isAuthenticated}
      onNavigate={(nextPage) => navigate(pageToPath[nextPage] ?? "/")}
      onCreateEvent={handleCreateEvent}
      prefillName={profile?.fullName}
      prefillEmail={profile?.email}
    />
  );
}

function AuthRoutePage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  return <AuthPage mode={mode} onNavigate={(page) => navigate(pageToPath[page] ?? "/")} onAuthenticated={() => navigate("/dashboard")} />;
}

function DashboardRoute() {
  const ctx = useOutletContext<DashboardRouteContext>();
  return (
    <DashboardPage
      realtimeFeed={ctx.realtimeFeed}
      notificationsLoading={ctx.notificationsLoading}
      notificationsError={ctx.notificationsError}
      unreadNotificationsCount={ctx.unreadNotificationsCount}
      dashboardNotificationItems={ctx.dashboardNotificationItems}
      onOpenInbox={ctx.onOpenInbox}
      onLogout={ctx.onLogout}
      onExplore={ctx.onExplore}
      onMarkNotificationRead={ctx.onMarkNotificationRead}
      onNotificationItemClick={ctx.onNotificationItemClick}
    />
  );
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();
  const [globalInboxOpen, setGlobalInboxOpen] = useState(false);
  const { profile, isAuthenticated } = auth;
  const { markNotificationRead, realtimeFeed, notificationsLoading, notificationsError, unreadNotificationsCount, dashboardNotificationItems } = useNotificationContext();
  const handleLogout = useLogoutController({
    setPage: (page) => navigate(pageToPath[page]),
    setGlobalInboxOpen
  });

  const currentPage = pathToPage[location.pathname] ?? "home";

  const handleNavigate = (page: Page) => {
    navigate(pageToPath[page] ?? "/");
  };

  const handleCreateEvent = () => {
    if (isAuthenticated && profile && (profile.role === "Organizer" || profile.role === "Admin")) {
      navigate("/dashboard");
      return;
    }
    navigate("/signup");
  };

  const handleNotificationActivate = (item: ReturnType<typeof useNotificationContext>["dashboardNotificationItems"][number]) => {
    void markNotificationRead(item.id);
    if (item.relatedEventId) {
      setGlobalInboxOpen(false);
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-page">
      {!(currentPage === "dashboard" && isAuthenticated && profile?.role) ? (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          userRole={profile?.role ?? null}
          onLogout={handleLogout}
          onExploreEvents={() => navigate("/")}
          onCreateEvents={handleCreateEvent}
          inboxUnreadCount={unreadNotificationsCount}
          onOpenInbox={isAuthenticated && profile?.role ? () => setGlobalInboxOpen(true) : undefined}
        />
      ) : null}

      <GlobalInboxDrawer
        open={Boolean(globalInboxOpen && isAuthenticated && profile?.role && currentPage !== "login" && currentPage !== "signup")}
        unreadNotificationsCount={unreadNotificationsCount}
        dashboardNotificationItems={dashboardNotificationItems}
        realtimeFeed={realtimeFeed}
        notificationsLoading={notificationsLoading}
        notificationsError={notificationsError}
        onClose={() => setGlobalInboxOpen(false)}
        onMarkRead={(id) => void markNotificationRead(id)}
        onItemClick={handleNotificationActivate}
      />

      <main className="flex-1 px-4 pb-10 md:px-10">
        <Outlet
          context={{
            realtimeFeed,
            notificationsLoading,
            notificationsError,
            unreadNotificationsCount,
            dashboardNotificationItems,
            onOpenInbox: () => setGlobalInboxOpen(true),
            onLogout: handleLogout,
            onExplore: () => navigate("/"),
            onMarkNotificationRead: markNotificationRead,
            onNotificationItemClick: handleNotificationActivate
          } satisfies DashboardRouteContext}
        />
      </main>

      <Footer onNavigate={(page) => handleNavigate(page as Page)} />
    </div>
  );
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PublicRoutePage page="home" />} />
          <Route path="/about" element={<PublicRoutePage page="about" />} />
          <Route path="/contact" element={<PublicRoutePage page="contact" />} />
          <Route path="/support" element={<PublicRoutePage page="support" />} />
          <Route path="/login" element={<AuthRoutePage mode="login" />} />
          <Route path="/signup" element={<AuthRoutePage mode="signup" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

