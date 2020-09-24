import React from 'react'

const ContainerFull = ({ children, className }) => {
  return <section className={`inline-block relative w-full min-h-display md:h-screen text-white py-20 md:py-16 md:py-32 px-5 md:px-12 leading-relaxed z-10 ${className ? className : ''}`}>{children}</section>
}

export default ContainerFull
