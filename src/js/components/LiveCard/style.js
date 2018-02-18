import styled from 'styled-components'

const RaisedContainer = styled.div`
  padding: 10px 0;
`
const NameContainer = styled.div`
  padding-bottom: 10px;
`
const CheerContainer = styled(NameContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme['Team Activity']}
`

const TeamName = styled.div`
  font-size: 16px;
  font-weight: 700;
`
const TeamSubName = styled.div`
  color: ${props => props.theme.textDampen}
`

export {
  RaisedContainer,
  NameContainer,
  CheerContainer,
  TeamName,
  TeamSubName,
}
