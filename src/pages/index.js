import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { eachMonthOfInterval } from 'date-fns'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
import SEO from '../components/seo'

// Container(s)
import Layout from '../containers/layout'

// Pool
import Pool from '../contracts/pool.json'

// fyDai ABI
const fyDai = [
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

const ParagraphClass = 'text-sm lg:text-baseline text-gray-500 mb-2'
const HeadingClass = 'text-2xl lg:text-4xl font-bold font-display mb-2'

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

  /* Seconds per year */
  const secondsPerYear = 365.25 * 24 * 60 * 60

  /* Set state for yields */
  const initState = {
    seriesRates: new Map(),
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
      provider = ethers.getDefaultProvider('homestead', {
        etherscan: process.env.ETHERSCAN_API_KEY,
        infura: process.env.INFURA_PROJECT_ID,
        alchemy: process.env.ALCHEMY_API_KEY,
      })
    }
  }

  /* State for addresses */
  const [addresses] = useState([
    {
      address: '0x6feb7B2a023C9Bc3ccCdF7c5B5a7b929B9a65E04',
    },
    {
      address: '0xF7dB19E0373937A13e4b12287B1C121Dfb2d9BF8',
    },
    {
      address: '0xb39221E6790Ae8360B7E8C1c7221900fad9397f9',
    },
    {
      address: `0xe523442a6c083016E2F430ab0780250ef4438536`,
    },
    {
      address: '0x8EcC94a91b5CF03927f5eb8c60ABbDf48F82b0b3',
    },
    {
      address: '0x6feb7B2a023C9Bc3ccCdF7c5B5a7b929B9a65E04',
    },
    {
      address: '0xF2C9c61487D796032cdb9d57f770121218AC5F91',
    },
  ])

  /* Round function */
  function roundToTwo(num) {
    return +(Math.round(num + 'e+2') + 'e-2')
  }

  /* Get the yield market rates for a particular set of series */
  const _getRates = async (seriesArr) => {
    const ratesData = await Promise.allSettled(
      seriesArr.map(async (x) => {
        const contract = new ethers.Contract(x.address, Pool.abi, provider)

        const fyDaiAddress = await contract.fyDai()
        const fyDaiContract = new ethers.Contract(fyDaiAddress, fyDai, provider)
        const fyDaiMaturity = await fyDaiContract.maturity()
        const parsedfyDaiMaturity = new Date(parseInt(fyDaiMaturity.toString()) * 1000)

        const amount = 1
        const parsedAmount = ethers.BigNumber.isBigNumber(amount)
          ? amount
          : ethers.utils.parseEther(amount.toString())

        const preview = await contract.sellFYDaiPreview(parsedAmount)

        const inEther = ethers.utils.formatEther(preview.toString())
        const object = {
          address: x.address,
          maturity: parsedfyDaiMaturity,
          isMature: parsedfyDaiMaturity < Math.round(new Date().getTime() / 1000),
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
        passData.push({ x: setDate, y: roundToTwo(getAPR), date: maturity })
      })

      const parseDateRange = passData.sort((a, b) => a.date - b.date)

      const results = eachMonthOfInterval({
        start: parseDateRange[0].date,
        end: [...parseDateRange].pop().date,
      })

      const monthsRange = results.map((date) => {
        const maturity = new Date(date)
        const maturityYear = maturity.getUTCFullYear()
        const maturityMonth = maturity.getUTCMonth() + 1
        const maturityDate = maturity.getUTCDate()
        const setDate = `${maturityYear}/${maturityMonth}/${maturityDate}`
        return {
          date: date,
          x: setDate,
          y: null,
        }
      })

      const map = new Map()
      passData.forEach((item) => map.set(item.date, item))
      monthsRange.forEach((item) => map.set(item.date, { ...map.get(item.date), ...item }))
      const mergedArr = Array.from(map.values())

      updateChartData(mergedArr.sort((a, b) => a.date - b.date))
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
        // cubicInterpolationMode: 'linear',
        lineTension: 0,
        borderColor: '#FFF',
        spanGaps: true,
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
    tooltips: {
      titleFontFamily: defaultFont,
      bodyFontFamily: defaultFont,
      callbacks: {
        label: (tooltipItem, data) => {
          // const readableDate = `${format(tooltipItem.xLabel, 'MMMM dd yyyy')}`
          let label = data.datasets[tooltipItem.datasetIndex].label || ''

          console.log(label)

          if (label) {
            label += ': '
          }
          label += `${tooltipItem.yLabel}%`

          return label
        },
      },
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            ...labelOptions,
            labelString: 'Maturity',
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
            fontFamily: tickFont,
            beginAtZero: 0,
            callback: function (value) {
              // return ((value / this.max) * 100).toFixed(0) + '%' // convert it to percentage
              return `${value}%`
            },
            min: 0,
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
          <div className="inline-block w-full mb-8">
            <h1 className={HeadingClass}>The Dai Yield Curve</h1>
            <p className={ParagraphClass}>
              Shown are the current offered interest rates for borrowing and lending Dai using the
              Yield Protocol
            </p>
            <div className="inline-block relative w-full">
              <a
                className="block mx-auto link text-sm text-gray-600 underline"
                href="https://yield.is/"
                target="_blank"
                rel="noreferrer noopener"
              >
                by Yield Protocol
              </a>
            </div>
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
