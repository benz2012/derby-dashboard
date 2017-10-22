import styled from 'styled-components'

const AppStyle = styled.div`
  display: block;
  box-sizing: : border-box;
  overflow-y: scroll;

  width: 100%;
  margin: 0;
  margin-bottom: 50px;
  border: 0;
  padding: 0;

  color: ${props => props.theme.contentFG};
  font-family: ${props => props.theme.fontBody};
  font-weight: 400;
  font-size: 14px;
`

const BodyStyle = {
  margin: 0,
  boxSizing: 'border-box',
  backgroundColor: '#f0f0f0',
  webkitTextSizeAdjust: '100%',
}

export { AppStyle, BodyStyle }
