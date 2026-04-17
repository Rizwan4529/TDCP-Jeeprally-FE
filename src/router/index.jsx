import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../layouts/Layout";
import ScrollToTop from "../components/common/ScrollToTop";
import NotFound from "../pages/NotFound";
import Loading from "../components/common/Loading";
import Sightseeing from "../pages/Sightseeing";

function AppRouter() {

  const isLoading = false
  const error = false
  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load application data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>

          <Route index element={<Sightseeing />} />



        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
