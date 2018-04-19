import styled from 'styled-components'

const TeamBlockContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  padding: ${props => props.tight ? '2px 0px' : '10px 0px'};
  text-decoration: none;
`

const TeamBlockLeft = styled.div`
  position: relative;
`

const TeamBlockImage = styled.div`
  margin-left: 20px;
`

const TeamBlockText = styled.div`
  margin-left: 10px;
`

const TeamBlockRight = styled.div`
  margin-left: auto;
  margin-right: 10px;
`

const TeamName = styled.div`
  font-size: 16px;
  font-weight: ${props => props.tight ? 300 : 700};
`
const TeamSubName = styled.div`
  color: ${props => props.theme.textDampen}
  color: ${props => props.darker ? props.theme.textDampenLess : props.theme.textDampen}
`


export {
  TeamBlockContainer,
  TeamBlockLeft,
  TeamBlockImage,
  TeamBlockText,
  TeamBlockRight,
  TeamName,
  TeamSubName,
}
