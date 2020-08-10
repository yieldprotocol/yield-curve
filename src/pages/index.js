import React from 'react'
import { VictoryChart } from 'victory'
import { VictoryLine, Curve } from 'victory'
import { VictoryContainer, VictoryTheme, Point } from 'victory'

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
const HeadingClass = 'text-xl lg:text-3xl font-bold mb-6'

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

  const sampleData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 },
  ]

  return (
    <Layout>
      <SEO title={siteTitle} description={siteDescription} keywords={siteKeywords} />
      <Container className="text-left md:text-center">
        <div className="inline-block w-full py-24 md:py-48">
          <div className="inline-block w-full max-w-3xl">
            <h1 className={HeadingClass}>The Yield Curve</h1>
            <p className={ParagraphClass}>Uhhh.... the curves yield, yo!</p>
            <VictoryLine
              interpolation="natural"
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={sampleData}
            />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default IndexPage
