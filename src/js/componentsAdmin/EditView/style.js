import styled from 'styled-components'

const EditContainer = styled.div`
  z-index: 70;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`
const EditPane = styled.div`
  width: 60%;
  max-width: 700px;
  height: auto;
  max-height: 85%;

  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  background-color: white;
  border-radius: 3px;
  cursor: auto;
`
const ViewContent = styled.div`
  padding: 25px;
  flex-grow: 1;
  overflow: scroll;
  margin-bottom: 50px;
`
const ViewActions = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;

  display: flex;
  justify-content: flex-end;
  padding: 6px 0px;
`

export {
  EditContainer,
  EditPane,
  ViewContent,
  ViewActions,
}
