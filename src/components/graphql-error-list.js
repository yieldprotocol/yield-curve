import React from 'react'

const GraphQLErrorList = ({ errors }) => (
  <div>
    <h1>GraphQL Error</h1>
    {errors.map((error) => (
      <pre key={`err-${error.message}`}>{error.message}</pre>
    ))}
  </div>
)

export default GraphQLErrorList
