import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./router/index.jsx";

// swiper imports
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// lightbox imports
import "yet-another-react-lightbox/styles.css";

import QueryProvider from "./api/QueryProvider.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
