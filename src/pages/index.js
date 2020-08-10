import React from 'react'

// Component(s)
import Container from '../components/container'

// Container(s)
import Layout from '../containers/layout'

export default function Home() {
  const { errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title={siteTitle} description={siteDescription} keywords={siteKeywords} />
      <Container className="text-left md:text-center">
        <div class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Hello Gatsby!
        </div>
      </Container>
    </Layout>
  )
}
