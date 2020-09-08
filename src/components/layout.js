import React from 'react'

import Header from './header'
import SEO from './seo'

import '../styles/main.sass'

const Layout = (props) => {
  const { siteTitle } = props
  return (
    <div className="font-sans">
      <SEO />
      <Header siteTitle={siteTitle} />
      {props.children}
    </div>
  )
}

export default Layout
