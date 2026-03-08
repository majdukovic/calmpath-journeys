import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import SOSFlow from "./pages/SOSFlow";
import DailyCalm from "./pages/DailyCalm";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import { getData } from "./lib/storage";

const queryClient = new QueryClient();

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(!getData().settings.onboardingCompleted);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
          <Routes>
            <Route path="/sos" element={<SOSFlow />} />
            <Route path="/daily-calm" element={<DailyCalm />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/journal" element={<Layout><Journal /></Layout>} />
            <Route path="/learn" element={<Layout><Learn /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
