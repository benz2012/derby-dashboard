import React from 'react'

import { TextInput } from './Form'

const ListData = ({ data, dataKey, renderInput, errors, onChange, onDelete }) => (
  data.sort((a, b) => (parseInt(b.id) - parseInt(a.id)))
    .map(dataItem => (
      <div key={dataItem.id} className="form-row align-items-center" style={{ marginBottom: '24px' }}>
        <div className="col-md-10">
          {renderInput ? (
            renderInput({ ...dataItem })
          ) : (
            <TextInput
              id={`input.${dataKey}.${dataItem.id}`}
              value={dataItem.value}
              onChange={onChange}
              error={errors && errors[dataKey] && errors[dataKey][dataItem.id]}
              required
            />
          )}
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={() => onDelete(dataItem.id)}>
            Delete
          </button>
        </div>
      </div>
    ))
)

export default ListData
