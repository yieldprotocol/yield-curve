/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

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
    description: `Some description can go here...`,
    author: `yield`,
    email: `hi@yield.is`,
  },
}
