import React from 'react'
import { Helmet } from 'react-helmet-async'
import { StaticQuery, graphql } from 'gatsby'

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`

function SEO({ description, keywords, title, image, lang, meta, url }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={(data) => {
        if (!data.site) {
          return
        }
        const metaDescription = description || data.site.siteMetadata.description
        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={title}
            titleTemplate={
              title === data.site.siteMetadata.title ? '%s' : `%s | ${data.site.siteMetadata.title}`
            }
            link={[
              {
                href: 'https://curve.yield.is/favicons/apple-touch-icon.png',
                sizes: '180x180',
                rel: 'apple-touch-icon',
              },
              {
                href: 'https://curve.yield.is/favicons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
                rel: 'icon',
              },
              {
                href: 'https://curve.yield.is/favicons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
                rel: 'icon',
              },
              {
                href: 'https://curve.yield.is/favicons/site.webmanifest',
                rel: 'manifest',
              },
              {
                href: 'https://curve.yield.is/favicons/safari-pinned-tab.svg',
                color: '#5f47dc',
                rel: 'mask-icon',
              },
              {
                href: 'https://curve.yield.is/favicons/favicon.ico',
                rel: 'shortcut icon',
              },
              {
                href:
                  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                rel: 'stylesheet',
              },
            ]}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'fb:app_id',
                content: '',
              },
              {
                property: 'og:image',
                content: image,
              },
              {
                property: 'og:image:width',
                content: '1920',
              },
              {
                property: 'og:image:height',
                content: '1080',
              },
              {
                property: 'og:title',
                content: title,
              },
              {
                property: 'og:description',
                content: metaDescription,
              },
              {
                property: 'og:type',
                content: 'website',
              },
              {
                property: 'og:url',
                content: url,
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
              },
              {
                name: 'twitter:title',
                content: title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
              {
                content: '#603cba',
                name: 'msapplication-TileColor',
              },
              {
                content: 'https://curve.yield.is/favicons/browserconfig.xml',
                name: 'msapplication-config',
              },
              {
                content: '#5f47dc',
                name: 'theme-color',
              },
            ]
              .concat(
                keywords && keywords.length > 0
                  ? {
                      name: 'keywords',
                      content: keywords.join(', '),
                    }
                  : []
              )
              .concat(meta)}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  keywords: [],
  description: 'Yield Curve Graph',
  title: 'Yield Curve',
  image: 'https://curve.yield.is/img/social.png',
  lang: 'en',
  meta: [],
  url: 'https://curve.yield.is/',
}

export default SEO
