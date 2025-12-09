import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route
        path="*"
        element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
