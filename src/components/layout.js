import React from 'react'

// import Header from './navbar'
// import Footer from './footer'
import SEO from './seo'

import '../styles/main.scss'

const Layout = () => {
  const { siteTitle, download, email } = props
  return (
    <>
      <SEO />
      {/* <Header siteTitle={siteTitle} /> */}
      {props.children}
      {/* <Footer siteTitle={siteTitle} email={email} /> */}
    </>
  )
}

export default Layout
