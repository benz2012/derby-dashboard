import styled from 'styled-components'

const Avatar = styled.img`
  width: ${props => (props.size ? `${props.size}px` : '40px')};
  border-radius: 50%;
`

export default Avatar
