import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'
import BackToTop from '../components/common/BackToTop'

const Layout = () => {
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