/*
 * Estúdio de publicação: casca mínima e clara para a experiência editorial.
 * A navegação principal vive em Home.tsx; o tema global usa marfim + azul-petróleo.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return <Switch><Route path="/" component={Home} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-right" toastOptions={{ classNames: { toast: "atlas-toast" } }} /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
