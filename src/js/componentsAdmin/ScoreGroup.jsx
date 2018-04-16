import React from 'react'

import { TextInput, CheckboxInput } from './Form'

const ScoreGroup = ({ teams, onChange, includeAll }) => (
  <div className="mt-3">
    <div className="btn-group mb-2" role="group">
      <button className="btn btn-info btn-sm" onClick={includeAll} data-yes>Include All</button>
      <button className="btn btn-secondary btn-sm" onClick={includeAll}>Include None</button>
    </div>
    {teams.map(t => (
      <div className="form-row align-items-center" key={`${t.id}-score-key`}>
        <div className="col">
          <TextInput
            id={`input.scores.${t.id}.score`}
            label={t.name}
            value={t.score}
            onChange={onChange}
            disabled={!t.include}
          />
        </div>
        <div className="col">
          <CheckboxInput
            id={`input.scores.${t.id}.include`}
            label="Include"
            value={t.include}
            onChange={onChange}
          />
        </div>
      </div>
    ))}
  </div>
)

export default ScoreGroup
