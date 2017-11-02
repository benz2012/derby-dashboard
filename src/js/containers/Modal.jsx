/* eslint react/sort-comp: 0 */
import { Component } from 'react'
import ReactDOM from 'react-dom'

import { Blur } from '../styles/app'


export default class Modal extends Component {
  modalRoot = document.getElementById('modal')
  el = document.createElement('div')

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
    const app = document.getElementById('app')
    app.setAttribute('style', Blur)
  }
  componentWillUnmount() {
    this.modalRoot.removeChild(this.el)
    const app = document.getElementById('app')
    app.setAttribute('style', '')
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    )
  }
}
