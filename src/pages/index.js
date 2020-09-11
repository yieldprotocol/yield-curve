import React, { useState, useEffect } from 'react'
import { Chart } from 'react-charts'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool.json'

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

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'updateRates':
      return {
        ...state,
        seriesRates: action.payload,
      }
    default:
      return state
  }
}

const IndexPage = (props) => {
  const { data, errors } = props

  /* Set state for yields */
  const initState = {
    seriesRates: new Map(),
  }

  const [chartData, updateChartData] = React.useState([])
  // const [provider, updateProvider] = React.useState({})
  const [state, dispatch] = React.useReducer(reducer, initState)

  /* Update imports */
  let ethers
  let provider
  const getImports = async () => {
    if (process.browser && typeof window !== 'undefined') {
      ethers = require('ethers')
      // Default provider
      provider = ethers.getDefaultProvider('rinkeby')
    }
  }

  /* State for addresses */
  const [addresses] = useState([
    {
      address: '0x34F9dB53Ec17b03Eb173B6487DFb4CA6703F6af9',
      maturity: new Date('2021-12-31').getTime(),
    },
    {
      address: '0x4f5AF74C1cd306B03144e9F94fE9317FADEE88e5',
      maturity: new Date('2021-01-01').getTime(),
    },
    {
      address: '0x8f29250B6510433C4ddCaf747621e00Ea0279654',
      maturity: new Date('2020-09-06').getTime(),
    },
    {
      address: '0xcdAd94bAd9AF4c9a4E1b6Bf33545F68191f8060E',
      maturity: new Date('2021-10-01').getTime(),
    },
  ])

  /* Annualized yield rate */
  const yieldAPR = (
    _rate,
    _return,
    _maturity,
    _fromDate = Math.round(new Date().getTime() / 1000) // if not provided, defaults to current time.
  ) => {
    if (_maturity > Math.round(new Date().getTime() / 1000)) {
      const secsToMaturity = _maturity - _fromDate
      const propOfYear = secsToMaturity / 365 * 24 * 60 * 60 // seconds per year
      const priceRatio =
        parseFloat(ethers.utils.formatEther(_return)) / parseFloat(ethers.utils.formatEther(_rate))
      const powRatio = 1 / propOfYear
      const apr = Math.pow(priceRatio, powRatio) - 1
      return apr * 100
    }
    return 0
  }

  /* Get the yield market rates for a particular set of series */
  const _getRates = async (seriesArr) => {
    /* 
      Rates:
        sellYDai -> Returns how much Dai would be obtained by selling 1 yDai
        buyDai -> Returns how much yDai would be required to buy 1 Dai
        buyYDai -> Returns how much Dai would be required to buy 1 yDai
        sellDai -> Returns how much yDai would be obtained by selling 1 Dai
    */
    const ratesData = await Promise.allSettled(
      seriesArr.map(async (x, i) => {
        const _x = { ...x, isMature: () => x.maturity < Math.round(new Date().getTime() / 1000) }
        const contract = new ethers.Contract(x.address, Pool.abi, provider)
        const amount = 1
        const parsedAmount = ethers.BigNumber.isBigNumber(amount)
          ? amount
          : ethers.utils.parseEther(amount.toString())
        const preview = await contract.sellDaiPreview(parsedAmount)
        const inEther = ethers.utils.formatEther(preview.toString())
        const object = {
          address: _x.address,
          maturity: x.maturity,
          isMature: _x.isMature(),
          sellPreview: inEther,
        }
        console.log(object) // logging the object from above
        return object
      }, state.seriesRates)
    )

    const filteredRates = ratesData.filter((p) => p.status === 'fulfilled')

    /* update context state and return */
    dispatch({ type: 'updateRates', payload: filteredRates })
    return filteredRates
  }

  /* Update list */
  const updateSeries = async () => {
    const rates = await _getRates(addresses)
    if (rates && rates.length > 0) {
      let passData = []
      rates.map((object, index) => {
        const getAPR = yieldAPR(object.value.sellPreview, object.value.maturity)
        console.log(`APR: ${getAPR} for ${object.value.address}`)
        passData.push([index, getAPR])
      })
      updateChartData([
        {
          data: passData,
        },
      ])
    }
  }

  /* Run on page load */
  useEffect(() => {
    /* Get these imports if browser */
    getImports()
    /* Get series rates and update */
    updateSeries()
  }, [])

  // const chartData = React.useMemo(
  //   () => [
  //     {
  //       // label: 'Series 1',
  //       data: [
  //         [0, 1],
  //         [1, 2],
  //         [2, 4],
  //         [3, 2],
  //         [4, 7],
  //       ],
  //     },
  //   ],
  //   []
  // )

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
