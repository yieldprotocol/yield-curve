import React from 'react'
import { VictoryChart, VictoryLabel, VictoryLine } from 'victory'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import Container from '../components/container'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'
import { theme } from '../../tailwind.config'

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

const ParagraphClass = 'text-sm lg:text-baseline text-gray-200 mb-8'
const HeadingClass = 'text-2xl lg:text-4xl font-bold mb-6'

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

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  let sampleData = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    {
      x: 3,
      y: getRandomInt(1, 8),
    },
    { x: 4, y: 4 },
    {
      x: 5,
      y: getRandomInt(1, 8),
    },
  ]

  return (
    <Layout>
      <SEO title={siteTitle} description={siteDescription} keywords={siteKeywords} />
      <Container className="text-left md:text-center">
        <div className="inline-block w-full py-24 md:py-48">
          <div className="inline-block w-full">
            <h1 className={HeadingClass}>The Yield Curve</h1>
            <p className={ParagraphClass}>Uhhh.... the curves yield, yo!</p>
            <VictoryChart
              style={{
                labels: { fontSize: 8 },
              }}
            >
              <VictoryLine
                interpolation="natural"
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },
                }}
                data={sampleData}
              />
            </VictoryChart>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default IndexPage
