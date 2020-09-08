import React from 'react'
import { Link } from 'gatsby'

const Logotype = ({ company }) => (
  <Link className="inline-block text-white font-semibold link font-display" title={company} to="/">
    <img
      className="inline-block align-middle mr-4 w-6 lg:w-8"
      alt={company}
      src="/logo-white.svg"
    />
    <strong className="hidden md:inline-block align-middle">Yield</strong>
  </Link>
)

export default Logotype
