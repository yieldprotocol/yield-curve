import React from 'react'
import { Link } from 'gatsby'

const Logotype = ({ company }) => (
  <Link className="inline-block text-white font-semibold link font-display" title={company} to="/">
    <img
      className="inline-block align-middle mr-4 w-16"
      alt={company}
      src="/type-white.svg"
    />
  </Link>
)

export default Logotype

