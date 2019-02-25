import React from 'react'

import { TextInput, CheckboxInput } from './Form'

const ScoreGroup = ({ teams, errors, onChange, includeAll }) => (
  <div className="mt-3">
    <div className="btn-group mb-2" role="group">
      <button type="button" className="btn btn-info btn-sm" onClick={includeAll} data-yes>Include All</button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={includeAll}>Include None</button>
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
            error={errors && errors.scores && errors.scores[t.id] && errors.scores[t.id].score}
            required
            pattern="[0-9]+"
            title="Scores should be integer numbers."
          />
        </div>
        <div className="col pt-4">
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
