import React from 'react'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import Container from '../components/container'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'

export const query = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`

const ParagraphClass = 'text-sm lg:text-baseline text-gray-600 mb-8'
const HeadingClass = 'text-xl lg:text-3xl font-semibold mb-6'

const IndexPage = (props) => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site

  if (!site) {
    throw new Error('Missing "Site settings". Add some content to gatsby-config')
  }

  const siteTitle = site.siteMetadata.title
  const siteDescription = site.siteMetadata.description
  const siteKeywords = site.siteMetadata.keywords

  return (
    <Layout>
      <SEO title={siteTitle} description={siteDescription} keywords={siteKeywords} />
      <Container className="text-left md:text-center">
        <div className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Hello Gatsby!
        </div>
      </Container>
    </Layout>
  )
}

export default IndexPage
