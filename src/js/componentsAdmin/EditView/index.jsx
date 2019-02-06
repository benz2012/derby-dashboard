import React from 'react'

import Modal from '../../containers/Modal'
import Status from '../../components/Status'
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
  const show = rest.result !== null
  const success = rest.result && rest.result === 'SUCCESS'
  const task = rest.task || 'Updated'
  const message = rest.result === 'SUCCESS' ? `Item ${task} Successfully!` : `Item Failed to be ${task}!`
  const actionName = task === 'Removed' ? 'Delete' : 'Submit'
  const actionColor = task === 'Removed' ? 'danger' : 'primary'
  const actionDisabled = task !== 'Updated' && success

  return (
    <div role="button" onClick={back} tabIndex={0}>
      <Modal radius={3}>
        <EditContainer className="close-modal">
          <EditPane>
            <button
              type="button"
              className="close close-modal mr-2"
              style={{ outline: 'none', textAlign: 'right' }}
              aria-label="Close"
              onClick={back}
            >
              <span aria-hidden="true" className="close-modal">&times;</span>
            </button>
            <Status show={show} success={success} message={message} />
            <ViewContent>
              {children}
            </ViewContent>
            <ViewActions>
              <button type="button" className="close-modal btn btn-outline-dark mr-2" onClick={back}>
                {actionDisabled ? 'Close' : 'Cancel'}
              </button>
              <button
                type="button"
                className={`btn btn-outline-${actionColor} mr-2`}
                onClick={submit}
                disabled={actionDisabled}
              >
                {actionName}
              </button>
            </ViewActions>
          </EditPane>
        </EditContainer>
      </Modal>
    </div>
  )
}

export default EditView
