import React, { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import { VictoryChart, VictoryLabel, VictoryLine } from 'victory'

// Component(s)
import GraphQLErrorList from '../components/graphql-error-list'
import Container from '../components/container'
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

const ParagraphClass = 'text-sm lg:text-baseline text-gray-200 mb-8'
const HeadingClass = 'text-2xl lg:text-4xl font-bold mb-6'

const IndexPage = (props) => {
  const { data, errors } = props

  // Maturity, not sure if needed tbh
  const maturity = [12, 24, 48, 72]

  // Handle ethers
  const [contract, setContract] = useState(null)
  useEffect(() => {
    async function getContract() {
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // console.log(provider)

      // Hardcoded addresses (for now)
      const rinkebyAddrs = {
        Weth: '0x92265df39A1aE9f8aBf0e6E2d8613189948F81b1',
        Treasury: '0xCE3beF0f43AFF13FD0392Da164e815A4fDc1C385',
        Migrations: '0x6b86cb60E2e10b773e9Bb1F9621458607453dE97',
        'yDai-2020-08-21-Pool': {
          addr: '0x624449B4227510010576079588242a273458e4e8',
          abi: '000000000000000000000000624449b4227510010576079588242a273458e4e8',
        },
        End: '0xbc073be9EBeC52702AeC0b2C0Ec9134948bA137d',
        'yDai-2020-08-20-Pool': '0x6e6961455dd14F4011166bC85e8B37AE4eCBE5E1',
        Dai: '0xBb4a5c61F98932921374FFD0D7AbB597a224D972',
        'yDai-2020-08-23-Pool': '0x49da1634612BF9f0158Cac809004c2294338f2b7',
        Vat: '0x56C4555a512Af3747F2cA15a5E1238de1982806F',
        Multicall: '0x42B24E6D5F733e63949bCe7BFF782177726444F7',
        Controller: '0x31cc3CF1d7Aa628F82D7904a72D7cE6ECD35e0b7',
        WethJoin: '0x477638CBAb060fE352ED2eA45B8802EAa1c6d662',
        yDai0: '0x8833Ba46e4d5598b587cae9033EDA844dCc72b52',
        yDai1: '0xc749b1fb8790C186C8717755927349737ca59b1b',
        'yDai-2020-08-22-Pool': '0x1a16df5eB12E41F3b9AD4B2B584107D0A709B984',
        Pot: '0x69567757a8a82C5BC8648c92d0FEC15ebD93D768',
        Chai: '0xa2B81205422fB38825a722d3C6b2FCa516835F5D',
        yDai2: '0xa78Ff886199c2881ECd1bC7C8B998A2Fe991574E',
        DaiJoin: '0x9cDEf2a7839557A21A0618E925009072Ef530DBB',
        Uniswap: '0x6d1759237cAFa696A0A81e5195B6dFB815f19230',
        Flash: '0xd31c8A5d632c9e73986Da870cAbF419d0Acf8903',
        Liquidations: '0x02A22f488c4A01B75815A743c83d337E6023A784',
        yDai3: '0xA230C2F8Dc7c212C76E1c63C0E6d38c339F3D730',
        Unwind: '0xAb402B9b1721C4e3fCCc56d7F63094A102ca4739',
      }

      const provider = ethers.getDefaultProvider('rinkeby')

      const contract = new ethers.Contract(
        '0x624449B4227510010576079588242a273458e4e8',
        Pool.abi,
        provider
      )
      const contractAwait = await contract.sellDaiPreview(BigNumber.from(42))
      setContract(contractAwait)
    }
    getContract()
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
