import React from 'react'

import DataCard from '../DataCard'

const DataBin = ({ items, head, body, id, onEdit, onDelete }) => (
  items.map((i) => {
    const itemId = id ? id(i) : i.id
    return (
      <DataCard
        key={itemId}
        id={itemId}
        head={head && head(i)}
        body={body && body(i)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  })
)

export default DataBin
