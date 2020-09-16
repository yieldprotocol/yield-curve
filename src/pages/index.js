import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool.json'

// EDAI ABI
const eDai = [
  'function maturity() view returns (uint256)',
  'function isMature() view returns(bool)',
  'function mature()',
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function redeem(address, address, uint256)',
]

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
    case 'updateLastMonth':
      return {
        ...state,
        lastMonth: action.payload,
      }
    default:
      return state
  }
}

const IndexPage = (props) => {
  const { data, errors } = props

  /* Seconds per year */
  const secondsPerYear = 365.25 * 24 * 60 * 60

  /* Set state for yields */
  const initState = {
    seriesRates: new Map(),
    lastMonth: new Date(),
  }

  const [chartData, updateChartData] = React.useState([])
  const [state, dispatch] = React.useReducer(reducer, initState)

  /* Update imports */
  let ethers
  let provider
  const getImports = async () => {
    if (process.browser && typeof window !== 'undefined') {
      ethers = require('ethers')

      // Default provider
      provider = ethers.getDefaultProvider('kovan')
    }
  }

  /* State for addresses */
  const [addresses] = useState([
    {
      address: '0xa4d02E3281E7CE2f1a398BA6DC79fdb5B537F731',
    },
    {
      address: '0x2CEFcB458Ad3da4E880F11611CE7AFA81afe059e',
    },
    {
      address: '0xb2A07439559fb29E800655a4e3f9901aeB8A11a1',
    },
    {
      address: '0x5284BF5D90852467dB2DBad700e0e98f2689C93b',
    },
    {
      address: '0x1EC085F7ae44Ab95577F4F63fe4Eb1A5e8f16cf4',
    },
  ])

  /* Get the yield market rates for a particular set of series */
  const _getRates = async (seriesArr) => {
    const ratesData = await Promise.allSettled(
      seriesArr.map(async (x) => {
        const contract = new ethers.Contract(x.address, Pool.abi, provider)

        const eDaiAddress = await contract.eDai()
        const eDaiContract = new ethers.Contract(eDaiAddress, eDai, provider)
        const eDaiMaturity = await eDaiContract.maturity()
        const parsedEDaiMaturity = new Date(parseInt(eDaiMaturity.toString()) * 1000)

        const amount = 1
        const parsedAmount = ethers.BigNumber.isBigNumber(amount)
          ? amount
          : ethers.utils.parseEther(amount.toString())

        const preview = await contract.sellEDaiPreview(parsedAmount)

        const inEther = ethers.utils.formatEther(preview.toString())
        const object = {
          address: x.address,
          maturity: parsedEDaiMaturity,
          isMature: parsedEDaiMaturity < Math.round(new Date().getTime() / 1000),
          sellPreview: inEther,
        }
        return object
      }, state.seriesRates)
    )

    const filteredRates = ratesData.filter((p) => {
      return p.status === 'fulfilled'
    })

    /* update context state and return */
    dispatch({ type: 'updateRates', payload: filteredRates })
    return filteredRates
  }

  /* Annualized yield rate */
  const yieldAPR = (
    _rate,
    _maturity,
    _fromDate = Math.round(new Date().getTime() / 1000) // if not provided, defaults to current time.
  ) => {
    if (_maturity > Math.round(new Date().getTime() / 1000)) {
      const secsToMaturity = _maturity / 1000 - _fromDate
      const propOfYear = secsToMaturity / secondsPerYear
      const setReturn = parseFloat(1.0) // override to use float
      const priceRatio = setReturn / _rate
      const powRatio = 1 / propOfYear
      const apr = Math.pow(priceRatio, powRatio) - 1
      return apr * 100
    }
    return 0
  }

  /* Update list */
  const updateSeries = async () => {
    const rates = await _getRates(addresses)
    if (rates && rates.length > 0) {
      let passData = []
      rates.map((object) => {
        const getAPR = yieldAPR(
          object.value.sellPreview, // _rate
          object.value.maturity // _maturity
        )
        const maturity = new Date(object.value.maturity)
        const maturityYear = maturity.getUTCFullYear()
        const maturityMonth = maturity.getUTCMonth() + 1
        const maturityDate = maturity.getUTCDate()
        const setDate = `${maturityYear}/${maturityMonth}/${maturityDate}`
        console.log(
          `APR: ${getAPR} for ${object.value.address}, sellPreview: ${object.value.sellPreview}, maturing on ${setDate}`
        )
        passData.push({ x: setDate, y: getAPR })
      })
      updateChartData(passData)
      dispatch({ type: 'updateLastMonth', payload: rates.splice(-1)[0] })
      /* Update last date */
      // let dateObj = new Date()
      // const lastMonthDate = new Date(lastMonth)
      /* Test */
      // const dateStrings = []
      // const dateFormatOptions = {
      //   month: 'long',
      //   year: 'numeric',
      // }

      // for (var i = 0; i < 12; ++i) {
      //   dateStrings.unshift(lastMonthDate.toLocaleString('en-US', dateFormatOptions))
      //   dateObj.setMonth(lastMonthDate.getMonth() - 1)
      // }

      // console.log(dateStrings)
    }
  }

  /* Run on page load */
  useEffect(() => {
    /* Get these imports if browser */
    getImports()
    /* Get series rates and update */
    updateSeries()
  }, [])

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

  const defaultFont = "'Syne', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'"
  const tickFont = "'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'"

  const newData = {
    labels: chartData.map((o, i) => {
      return o.x
    }),
    datasets: [
      {
        borderColor: '#FFF',
        data: chartData.map((o, i) => {
          return o.y
        }),
        fill: false,
      },
    ],
  }

  const labelOptions = {
    fontFamily: defaultFont,
    fontWeight: '500',
    fontColor: '#999',
    fontSize: '18',
    display: true,
  }

  const options = {
    responsive: true,
    legend: {
      labels: {
        fontFamily: defaultFont,
      },
      display: false,
    },
    title: {
      display: false,
      text: 'Chart Title',
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            ...labelOptions,
            labelString: 'Maturity (UTC/GMT+0)',
          },
          ticks: {
            fontFamily: tickFont,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            ...labelOptions,
            labelString: 'Yield (APR)',
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100,
            fontFamily: tickFont,
          },
        },
      ],
    },
  }

  return (
    <Layout>
      <SEO title={siteTitle} description={siteDescription} keywords={siteKeywords} />
      <ContainerFull>
        <div className="inline-block relative w-full text-center overflow-hidden">
          <div className="inline-block w-full">
            <h1 className={HeadingClass}>The Yield Curve</h1>
            <p className={ParagraphClass}>Uhhh.... the curves yield, yo!</p>
          </div>
          <div className="inline-block relative w-full max-w-6xl">
            <Line options={options} data={newData} />
          </div>
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
