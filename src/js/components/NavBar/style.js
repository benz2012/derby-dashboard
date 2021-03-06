import styled from 'styled-components'

const NavBarContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  top: 0;
  z-index: 50;
  width: 100%;
  height: 50px;

  background-color: ${props => props.theme.headerBG};
`
const NavBarShadow = styled.div`
  position: fixed;
  top: 0;
  z-index: 40;
  width: 100%;
  height: 50px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4);
`

const TitleContainer = styled.div`
  flex-grow: 1;
  text-align: center;
  padding-right: 60px;

  color: ${props => props.theme.headerFG};
  font-size: 18px;
  font-weight: 700;
`

export {
  NavBarContainer,
  NavBarShadow,
  TitleContainer,
}
