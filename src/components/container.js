import React from 'react'

const Container = ({ children, className }) => {
  return (
    <article className={`container mx-auto px-5 py-5 leading-6 md:leading-8 ${className}`}>
      {children}
    </article>
  )
}

export default Container
