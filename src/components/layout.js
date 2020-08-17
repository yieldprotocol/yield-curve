import React from 'react'

import Header from './header'
import Footer from './footer'
import SEO from './seo'

import '../styles/main.sass'

const Layout = (props) => {
  const { siteTitle, email } = props
  return (
    <>
      <SEO />
      <Header siteTitle={siteTitle} />
      {props.children}
      <Footer siteTitle={siteTitle} email={email} />
    </>
  )
}

export default Layout
