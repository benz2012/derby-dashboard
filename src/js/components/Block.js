import styled from 'styled-components'

import media from '../styles/media'

const Block = styled.div`
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow: hidden;

  margin-bottom: 10px;
  padding: 10px 10px;

  background-color: ${props => props.theme.contentBG};
  color: ${props => props.theme.contentFG};

  ${media.desktop`
    width: 600px;
    margin: auto;
    margin-bottom: 10px;
    border-radius: 3px;
  `}
`

export default Block
