import React, { useState, useEffect, useReducer } from 'react'
import { ethers, BigNumber } from 'ethers'
import { Chart } from 'react-charts'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool'

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

const ParagraphClass = 'text-sm lg:text-baseline text-gray-500 mb-8'
const HeadingClass = 'text-2xl lg:text-4xl font-bold font-display mb-6'

const IndexPage = (props) => {
  const { data, errors } = props

  // Set state for yields
  const [haveReserves, setHaveReserves] = React.useState(false)
  const [reserves, setReserves] = React.useState([])

  // State for addresses
  const [addresses] = useState([
    {
      address: '0x34F9dB53Ec17b03Eb173B6487DFb4CA6703F6af9',
      date: new Date('2021-12-31'),
    },
    {
      address: '0xa160AC2C5f7a429865aD7586fb71d804A24D1a54', // this should be 0x4f5AF74C1cd306B03144e9F94fE9317FADEE88e5 but testing the 0 case scenario first
      date: new Date('2021-01-01'),
    },
    {
      address: '0x8f29250B6510433C4ddCaf747621e00Ea0279654',
      date: new Date('2020-09-06'),
    },
    {
      address: '0xcdAd94bAd9AF4c9a4E1b6Bf33545F68191f8060E',
      date: new Date('2021-10-01'),
    },
  ])

  // Set as a const to prevent infinite loop due to useEffect hook
  const fetchReserves = async () => {
    try {
      const provider = ethers.getDefaultProvider('rinkeby')

      const results = []

      await Promise.all(
        addresses.map(async (obj) => {
          const contract = new ethers.Contract(obj.address, Pool.abi, provider)
          const getYDaiReserves = await contract.getYDaiReserves()
          const reservesEth = ethers.utils.formatEther(getYDaiReserves) / 100000
          // console.log(reservesEth)
          results.push({
            // x: `${obj.date.getUTCMonth() + 1}/${obj.date.getUTCFullYear()}`,
            x: obj.date.getUTCMonth() + 1,
            y: reservesEth,
          })
        })
      )
      const sortedResults = results.sort((a, b) => b.x - a.x)
      const filteredResults = sortedResults.filter((i) => i.y > 0)
      setHaveReserves(true)
      setReserves(filteredResults)
    } catch (error) {
      console.log(error)
      setHaveReserves(false)
    }
  }

  // Only run this once per render
  useEffect(() => {
    fetchReserves()
  }, [haveReserves])

  console.log(reserves)

  const chartData = React.useMemo(
    () => [
      {
        // label: 'Series 1',
        // data: [
        //   [0, 1],
        //   [1, 2],
        //   [2, 4],
        //   [3, 2],
        //   [4, 7],
        // ],
        data: [...reserves],
      },
    ],
    [reserves]
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    []
  )

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
      <ContainerFull>
        <div className="inline-block relative w-full h-screen text-center overflow-hidden">
          <div className="inline-block w-full">
            <h1 className={HeadingClass}>The Yield Curve</h1>
            <p className={ParagraphClass}>Uhhh.... the curves yield, yo!</p>
          </div>
          <div
            className="inline-block relative w-full"
            style={{
              height: '50vh',
            }}
          >
            <Chart data={chartData} axes={axes} dark />
          </div>
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
