import styled from 'styled-components'

import media from '../styles/media'

const hideWhenSmall = Component => styled(Component)`
  &&& {
    display: none;
    ${media.tablet`
      display: inherit;
    `}
  }
`

const showWhenSmall = Component => styled(Component)`
  &&& {
    display: inherit;
    ${media.tablet`
      display: none;
    `}
  }
`

export {
  hideWhenSmall,
  showWhenSmall,
}
