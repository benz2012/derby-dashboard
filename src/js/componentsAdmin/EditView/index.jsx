import React from 'react'

import Modal from '../../containers/Modal'
import { EditContainer, EditPane, ViewContent, ViewActions } from './style'

const EditView = ({ history, match, children, submit, ...rest }) => {
  const back = (e) => {
    e.stopPropagation()
    const targetClasses = e.target.className.split(' ')
    if (targetClasses.includes('close-modal')) {
      if (rest.close) rest.close()
      const base = match.path.replace(`/${rest.path || 'edit'}`, '')
      history.replace(base)
    }
  }
  return (
    <div role="button" onClick={back} tabIndex={0}>
      <Modal radius={3}>
        <EditContainer className="close-modal">
          <EditPane>
            <ViewContent>
              {children}
            </ViewContent>
            <ViewActions>
              <button className="close-modal btn btn-outline-dark mr-2" onClick={back}>
                Cancel
              </button>
              <button className="btn btn-outline-primary mr-2" onClick={submit}>
                Submit
              </button>
            </ViewActions>
          </EditPane>
        </EditContainer>
      </Modal>
    </div>
  )
}

export default EditView
