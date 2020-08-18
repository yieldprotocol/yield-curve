import React from 'react'

import Header from './header'
import Footer from './footer'
import SEO from './seo'

import '../styles/main.sass'

const Layout = (props) => {
  const { siteTitle, email } = props
  return (
    <div className="font-sans">
      <SEO />
      <Header siteTitle={siteTitle} />
      {props.children}
      <Footer siteTitle={siteTitle} email={email} />
    </div>
  )
}

export default Layout
