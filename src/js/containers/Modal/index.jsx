/* eslint react/sort-comp: 0 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { AppStyle } from '../../styles/app'
import { Blur, Backdrop } from './style'
import SVGBlur from './SVGBlur'

export default class Modal extends Component {
  modalRoot = document.getElementById('modal')

  el = document.createElement('div')

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
    const app = document.getElementById('app')
    const radius = this.props.radius || 5
    app.setAttribute('style', Blur(radius))
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el)
    const app = document.getElementById('app')
    app.setAttribute('style', '')
  }

  render() {
    const radius = this.props.radius || 5
    const modal = (
      <AppStyle style={{ paddingBottom: '0px' }}>
        {this.props.children}
        <Backdrop />
        <SVGBlur radius={radius} />
      </AppStyle>
    )
    return ReactDOM.createPortal(
      modal,
      this.el,
    )
  }
}
