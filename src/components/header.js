import React from 'react'
import { Link } from 'gatsby'

const classMenuButton =
  'inline-block md:hidden bg-transparent border-none relative w-auto text-sm font-medium'
const classLinks =
  'inline-block align-middle w-full md:w-auto py-3 md:py-0 mx-0 md:mx-2 text-center text-xl md:text-base md:text-right font-medium link'

const Header = class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  closeMenu() {
    if (this.state.menuOpen) {
      this.setState({
        menuOpen: false,
      })
    }
  }

  render() {
    const { siteTitle } = this.props

    const MiddleNavLinks = [
      {
        title: 'About us',
        to: '/about',
      },
      {
        title: 'Contact us',
        to: '/contact',
      },
      {
        title: 'Careers',
        to: '/careers',
      },
      {
        title: 'Whitepaper',
        to: '/whitepaper',
      },
    ]

    const Logo = () => (
      <Link className="inline-block text-black font-semibold link mr-4" title={siteTitle} to="/">
        <img
          className="inline-block align-middle mr-2 w-8 lg:w-8"
          alt={siteTitle}
          src="/logo.svg"
        />
        <strong className="hidden md:inline-block align-middle">{siteTitle}</strong>
      </Link>
    )

    const MiddleNav = () => (
      <div className="inline-block w-full text-center py-8 md:py-0">
        {MiddleNavLinks.map((item, index) => (
          <Link
            className={`${classLinks} ${
              MiddleNavLinks.length !== index + 1 ? 'mr-0 md:mr-4' : 'mr-0 md:mr-0'
            }`}
            key={Math.random()}
            to={item.to}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )

    const RightNav = () => (
      <div className="relative w-auto text-center md:text-right">
        <a className="font-bold" href="https://twitter.com/yield">
          Get in touch
        </a>
      </div>
    )

    const CloseButton = () => (
      <button className={classMenuButton} onClick={this.closeMenu}>
        Close
      </button>
    )

    const MenuButton = () => (
      <button className={classMenuButton} onClick={this.toggleMenu}>
        Menu
      </button>
    )

    return (
      <nav
        aria-label="main-navigation"
        className="navbar inline-block fixed w-full left-0 top-0 z-20 border-none py-2 bg-offwhite"
        role="navigation"
      >
        {/* Mobile nav */}
        <div
          className={`mobile inline-block fixed overflow-y-auto overflow-x-hidden bg-offwhite text-center left-0 top-0 w-full h-screen px-5 py-2 z-30
          ${this.state.menuOpen ? `open` : ''}`}
        >
          <div className="flex w-100 justify-between items-center">
            <Logo />
            <div className="inline-block md:hidden relative text-right">
              <CloseButton />
            </div>
          </div>
          <div className="inline-block relative w-full mb-4">
            <MiddleNav />
            <RightNav />
          </div>
        </div>
        {/* Non-Mobile nav */}
        <div className={`container mx-auto px-5`}>
          <div className="flex w-full justify-between items-center">
            {/* Left & middle */}
            <div className="inline-block realtive text-left w-8/12">
              <Logo />
              <div className="hidden md:inline-block">
                <MiddleNav />
              </div>
            </div>
            {/* Right */}
            <div className="hidden md:inline-block relative text-right">
              <RightNav />
            </div>
            {/* Menu */}
            <div className="inline-block md:hidden relative text-right">
              <MenuButton />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
