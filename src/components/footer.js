import React from 'react'
import { Link } from 'gatsby'

import Container from './container'

const classColumns = 'w-full md:w-4/12 mb-6'
const classStrong = 'inline-block w-full font-bold text-md mb-4'
const classLinks =
  'inline-block w-full md:w-auto font-normal text-gray-600 text-sm mb-2 md:mb-0 mr-0 md:mr-8 link py-1'
const year = new Date().getFullYear()

const Footer = class extends React.Component {
  constructor(props) {
    super(props)
    this.getTime = this.getTime.bind(this)
  }

  render() {
    const { siteTitle, email } = this.props

    const footerLinks = [
      {
        title: siteTitle,
        list: [
          {
            title: 'About us',
            link: '/about',
          },
          {
            title: 'Mission',
            link: '/mission',
          },
          {
            title: 'Careers',
            link: '/careers',
          },
        ],
      },
      {
        title: 'Resources',
        list: [
          {
            title: 'Insights',
            link: '/insights',
          },
          {
            title: 'Whitepaper',
            link: '/paper',
          },
        ],
      },
      {
        title: 'Get in touch',
        list: [
          {
            external: true,
            title: 'Twitter',
            link: 'https://twitter.com/yield',
          },
          {
            title: 'Email us (old school)',
            link: '/contact',
          },
        ],
      },
    ]

    const LinkComponent = ({ title, list }) => (
      <div className={classColumns} key={`${title}-${Math.random()}`}>
        <strong className={classStrong}>{title}</strong>
        <ul className="inline-block w-full">
          {list.map((item, index) => (
            <li key={`list-${index}`}>
              {item.external ? (
                <a className={classLinks} target="_blank" href={item.link}>
                  {item.title} {item.cta}
                </a>
              ) : (
                <Link className={classLinks} to={item.link}>
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    )

    return (
      <footer className="inline-block w-full py-6">
        <Container>
          {/* Top line */}
          <div className="inline-block md:flex items-start justify-between w-full">
            {/* Logo */}
            <div className={classColumns}>
              <img
                className="inline-block align-middle mr-2 w-12 md:w-14"
                src="/logo.svg"
                alt={siteTitle}
              />
            </div>
            {/* Links */}
            {footerLinks.map((object, index) => (
              <LinkComponent title={object.title} list={object.list} key={index} />
            ))}
          </div>
          {/* Bottom line */}
          <div className="inline-block w-full my-8">
            <div className="inline-block relative w-full">
              <p className="w-full text-left text-sm text-gray-800">
                &copy; {year} {siteTitle}
              </p>
            </div>
            <div className="inline-block w-full md:3/12">
              <a
                className="text-xs text-gray-900 underline link"
                target="_blank"
                href="https://yield.is"
                rel="noopener noreferrer"
              >
                🍞 Yield
              </a>
            </div>
          </div>
        </Container>
      </footer>
    )
  }
}

export default Footer
