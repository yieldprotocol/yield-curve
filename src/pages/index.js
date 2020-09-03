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
        Unwind: '0x130dB1eA1F1cf076D0cd1e67B3b6d7fc521897bf',
        'yDai-t1-Pool': '0x72e673b9C3C176857F67e3e2C19b18F51A3D9157',
        'yDai-t0-Pool': '0x7C54591B7FEA8331154Ef3c3Ed01fdCC355ED2fb',
        'yDai-t2-Pool': '0x8CF19fF4f66113aC78C49e5FFC3aad87Be677344',
        'yDai-t3-Pool': '0xa160AC2C5f7a429865aD7586fb71d804A24D1a54',
        yDai2: '0xcc4829bd239128fDEE4544AF8CEa3c16E4d3C3aB',
        yDai1: '0x935ed1c9f3263DE8a36808129Ba4b89DEb1FDD41',
        yDai3: '0xc64020cc89DbC7ec6b21B70ecB9698C2a34Ed23D',
        yDai0: '0x014b973A92ec05AE39FB042B8a6BD4e87971402c',
        Treasury: '0x428fF97383d63199991627f79913Aded8fdBFeeF',
        Liquidations: '0x58Db1B1E69F9c8488Fe306A928020DAE6D5540D8',
        Controller: '0x733333293720BaaA5F4087385a677DE44A661a89',
        YieldProxy: '0x6fDB5C88ccfD3c6719bDA752C07b4E3F2382843F',
        Migrations: '0x884598BE33888f2eF19569054C69D178FbfA6A0c',
        Chai: '0x458231bBDE7f1d10Fe25E259252bA575cEc8760D',
        End: '0x72f0b20cC2d1E8BB4b3c4Aac2D08629B327066a5',
        Dai: '0x6A9865aDE2B6207dAAC49f8bCba9705dEB0B0e6D',
        WethJoin: '0xA6268caddf03356aF17C7259E10d865C9DF48863',
        Pot: '0x867E3054af4d30fCCF0fCf3B6e855B49EF7e02Ed',
        Vat: '0x6E631D87bF9456495dDC9bDa576534592f486964',
        Weth: '0xc421f99D871aC5793985fd86d8659B7bDACFc9AC',
        DaiJoin: '0xa956A2a53C3F8F3Dc02793F7b13e8121aD114c54',
      }

      const provider = ethers.getDefaultProvider('rinkeby')

      const contract = new ethers.Contract(rinkebyAddrs['yDai-t3-Pool'], Pool.abi, provider)
      const contractAwait = await contract.getDaiReserves()
      console.log(contractAwait) // temporarily logging
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
