import React from 'react'

const DataCard = ({ id, head, body, onEdit, onDelete }) => (
  <div className="card mb-3">
    <div className="card-body">
      { head &&
        <h5 className="card-title">{head}</h5>
      }
      { body &&
        <p className="card-text">{body}</p>
      }
      { onEdit &&
        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => onEdit(id)}>
          View/Edit
        </button>
      }
      { onDelete &&
        <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={() => onDelete(id)}>
          Delete
        </button>
      }
    </div>
  </div>
)

export default DataCard
