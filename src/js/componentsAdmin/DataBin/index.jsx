import React from 'react'

import DataCard from '../DataCard'

const DataBin = ({ items, head, body, id, isPublished, ...rest }) => (
  items.map((i) => {
    const itemId = id ? id(i) : i.id
    return (
      <DataCard
        key={itemId}
        id={itemId}
        head={head && head(i)}
        body={body && body(i)}
        isPublished={isPublished && isPublished(i)}
        {...rest}
      />
    )
  })
)

export default DataBin
