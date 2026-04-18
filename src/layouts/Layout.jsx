import React from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import BackToTop from '../components/common/BackToTop'
import { useEffect } from 'react'

const Layout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure component is rendered
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default Layout