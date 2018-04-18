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

const loadCSS = (location, id) => {
  if (document.getElementById(id)) return // prevents double loading
  const linkRef = document.createElement('link')
  linkRef.setAttribute('rel', 'stylesheet')
  linkRef.setAttribute('type', 'text/css')
  linkRef.setAttribute('href', location)
  linkRef.setAttribute('id', id)
  document.getElementsByTagName('head')[0].appendChild(linkRef)
}

const loadBootstrapCSS = () => {
  loadCSS('/bootstrap.min.css', 'bootstrap-css')
  loadCSS('/dashboard.css', 'bootstrap-dashboard-css')
  loadCSS('/react-select.css', 'react-select-css')
}

export {
  AppStyle,
  BodyStyle,
  loadBootstrapCSS,
}
