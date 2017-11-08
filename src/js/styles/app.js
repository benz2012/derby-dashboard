import styled from 'styled-components'

const AppStyle = styled.div`
  display: block;
  box-sizing: border-box;
  overflow: scroll;

  width: 100%;
  margin: 0;
  border: 0;
  padding: 0;
  padding-bottom: 50px;

  color: ${props => props.theme.contentFG};
  font-family: ${props => props.theme.fontBody};
  font-weight: 400;
  font-size: 14px;
`

const BodyStyle = {
  margin: 0,
  height: '100%',
  boxSizing: 'border-box',
  backgroundColor: 'hsl(220, 10%, 92%)',
  webkitTextSizeAdjust: '100%',
}


export {
  AppStyle,
  BodyStyle,
}
