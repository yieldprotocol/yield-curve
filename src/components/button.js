import React from 'react'
import { Link } from 'gatsby'

const ButtonClass = 'inline-block relative w-full text-center font-bold px-4 py-3 text-base rounded'

class Button extends React.Component {
  render() {
    const { outlined, external, primary, margin, full, type, text, to } = this.props

    const RenderClass = `${ButtonClass} ${
      outlined
        ? 'border-2 border-solid border-primary bg-transparent text-primary'
        : 'bg-primary text-white'
    } ${primary ? 'border-2 border-solid border-primary bg-primary' : 'bg-transparent'} ${
      margin ? margin : ''
    } ${full ? 'md:w-full' : 'md:w-auto'}`

    return (
      <>
        {external ? (
          <a className={RenderClass} target="_blank" href={to} rel="noopener noreferrer">
            {text || `Learn more`}
          </a>
        ) : type ? (
          <button className={RenderClass} type={type}>
            {text || `Learn more`}
          </button>
        ) : (
          <Link className={RenderClass} to={to}>
            {text || `Learn more`}
          </Link>
        )}
      </>
    )
  }
}

export default Button
