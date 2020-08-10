import { graphql, StaticQuery } from 'gatsby'
import React from 'react'

import Layout from '../components/layout'

const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        description
        author
        email
      }
    }
  }
`

function LayoutContainer() {
  return (
    <StaticQuery
      query={query}
      render={(data) => {
        if (!data.site) {
          throw new Error('Missing "Site settings". "Site settings" data')
        }
        return (
          <Layout
            {...props}
            siteTitle={data.site.siteMetadata.title}
            email={data.site.siteMetadata.email}
          />
        )
      }}
    />
  )
}

export default LayoutContainer
