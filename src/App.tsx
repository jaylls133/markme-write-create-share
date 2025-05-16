
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import EditorPage from "./pages/EditorPage";
import MyPagesPage from "./pages/MyPagesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { cleanupExpiredDocuments } from "./lib/storage";

const queryClient = new QueryClient();

const App = () => {
  // Clean up expired documents on app initialization
  useEffect(() => {
    cleanupExpiredDocuments();
    
    // Set up periodic cleanup (optional)
    const cleanupInterval = setInterval(() => {
      cleanupExpiredDocuments();
    }, 3600000); // Check every hour
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/my-pages" element={<MyPagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
