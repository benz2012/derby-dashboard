import React, { Component } from 'react'

import DataBin from '../componentsAdmin/DataBin'
import Loading from '../components/Loading'
import { dataFetch, objectSort } from '../util'
import { stringSort } from '../util/string'

export default class ChallengesPage extends Component {
  state = {
    unmounting: false,
    challenges: null,
  }
  componentDidMount() {
    dataFetch('/data/challenges').then((data) => {
      if (data[0] && data[0].name) objectSort(data, 'name', stringSort)
      if (!this.state.unmounting) this.setState({ challenges: data })
    })
  }
  componentWillUnmount() {
    this.setState({ unmounting: true })
  }
  itemClick = id => console.log(this.state.challenges.find(c => c.id === id))
  render() {
    const { challenges } = this.state
    if (!challenges) return <Loading />
    return (
      <div>
        <button className="btn btn-success mb-4">+ Add Challenge</button>
        <DataBin
          items={challenges}
          head={c => c.name}
          body={c => (
            <span>
              {c.description.substr(0, 100)}{c.description.length > 100 && '...'}<br />
              {c.scores && `Scores Added: ${c.scores.length}`}
            </span>
          )}
          onEdit={this.itemClick}
          onDelete={this.itemClick}
        />
      </div>
    )
  }
}
