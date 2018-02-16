import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-bottom: 5px;
  width: 100%;
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;

  padding: 10px 15px 7px 15px;
  border-radius: 3px;
  background: rgba(60, 60, 60, 0.1);
`

const Input = styled.input`
  border-style: none;
  background: transparent;
  outline: none;

  flex-grow: 1;
  color: rgb(0, 0, 0);
  font-size: 20px;
  line-height: 24px;
  vertical-align: middle;

  &::-webkit-input-placeholder {
    color: rgb(200, 200, 200);
  }

  &:focus ~ span {
    width: 100%;
    transition: 0.4s;
  }
`

const FocusBorder = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  width: 0;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-color: ${props => props.theme.buttonBG};
  transition: 0.4s;
`

export {
  Container,
  InputContainer,
  Input,
  FocusBorder,
}
