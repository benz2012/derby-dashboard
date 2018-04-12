import React from 'react'

import DataCard from '../DataCard'

const DataBin = ({ items, head, body, onEdit, onDelete }) => (
  items.map(i => (
    <DataCard
      key={i.id}
      id={i.id}
      head={head(i)}
      body={body(i)}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ))
)

export default DataBin
