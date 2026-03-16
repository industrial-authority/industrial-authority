import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter"; // Import Router
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AuditRequest from "./pages/AuditRequest";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router base="/industrial-authority"> {/* Add Router with base prop */}
            <Switch>
              <Route path={"/"} component={Home} />
              <Route path={"/audit-request"} component={AuditRequest} />
              <Route path={"/admin"} component={AdminDashboard} />
              <Route path={"/404"} component={NotFound} />
              {/* Final fallback route */}
              <Route component={NotFound} />
            </Switch>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
