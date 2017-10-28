import styled from 'styled-components'

const Header = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`

const Body = styled.div`
  font-weight: 300;
  padding-bottom: 3px;
`

const Ranking = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textDampen}
`

const Currency = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgb(69, 194, 80);
`

export {
  Header,
  Body,
  Ranking,
  Currency,
}
