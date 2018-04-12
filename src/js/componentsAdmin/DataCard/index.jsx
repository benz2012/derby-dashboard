import React from 'react'

const DataCard = ({ id, head, body, onEdit, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{head}</h5>
        <p className="card-text">{body}</p>
        <button className="btn btn-outline-dark btn-sm" onClick={() => onEdit(id)}>
          View/Edit
        </button>
        <button className="btn btn-outline-danger btn-sm ml-2" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default DataCard
