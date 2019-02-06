import React from 'react'

import { TextInput } from './Form'

const ListData = ({ data, dataKey, onChange, onDelete }) => (
  data.sort((a, b) => (parseInt(b.id) - parseInt(a.id)))
    .map(d => (
      <div key={d.id} className="form-row align-items-center" style={{ marginBottom: '24px' }}>
        <div className="col-md-10">
          <TextInput
            id={`input.${dataKey}.${d.id}`}
            value={d.value}
            onChange={onChange}
          />
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={() => onDelete(d.id)}>
            Delete
          </button>
        </div>
      </div>
    ))
)

export default ListData
