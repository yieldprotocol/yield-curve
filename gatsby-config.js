/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet-async',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        // Configure SASS to process Tailwind
        postCssPlugins: [require('tailwindcss')],
      },
    },
  ],
  siteMetadata: {
    title: `Yield Curve`,
    siteUrl: `https://curve.yield.is/`,
    description: `Coming soon!`,
    siteKeywords: ['yield', 'curve', 'crypto', 'cryptocurrency'],
    author: `yield`,
    email: `hi@yield.is`,
  },
}
