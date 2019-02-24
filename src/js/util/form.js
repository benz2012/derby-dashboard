const setDeep = (update, setState, mainKey) => {
  Object.keys(update).forEach((k) => {
    const v = update[k]
    if (k.indexOf('.') !== -1) {
      // object of objects, updating
      const k1 = k.split('.')[0]
      const k2 = k.split('.')[1]
      const k3 = k.split('.')[2]
      if (k3) {
        setState(prevState => ({
          [mainKey]: {
            ...prevState[mainKey],
            [k1]: {
              ...prevState[mainKey][k1],
              [k2]: {
                ...prevState[mainKey][k1][k2],
                [k3]: v,
              },
            },
          },
        }))
      } else {
        setState(prevState => ({
          [mainKey]: {
            ...prevState[mainKey],
            [k1]: {
              ...prevState[mainKey][k1],
              [k2]: v,
            },
          },
        }))
      }
    } else {
      setState(prevState => ({
        [mainKey]: {
          ...prevState[mainKey],
          [k]: v,
        },
      }))
    }
  })
}

const setInput = (update, setState) => setDeep(update, setState, 'input')

const setError = (update, setState) => setDeep(update, setState, 'errors')

const newValues = (state, input) => (
  Object.keys(input)
    .filter(k => input[k] !== state[k])
    .filter(k => input[k] !== '')
    .map(k => ({ [k]: input[k] }))
)

const substance = obj => (
  Object.keys(obj)
    .filter(key => obj[key] !== '')
    .reduce((prev, key) => {
      prev[key] = obj[key] // eslint-disable-line no-param-reassign
      return prev
    }, {})
)

const hasDefault = obj => typeof obj.preventDefault === 'function'

const formChildren = ['input', 'select', 'textarea'].join(', ')

const isFormValidAndSetErrors = (form, cls) => {
  const elms = form.querySelectorAll(formChildren)
  elms.forEach((elm) => {
    const id = elm.getAttribute('id')
    const title = elm.getAttribute('title')
    const customValid = elm.getAttribute('customvalid')
    const { validity } = elm

    elm.setCustomValidity('')
    if (validity.valid === true && customValid) {
      const customValidity = cls[customValid]({ id })
      if (customValidity !== '') {
        elm.setCustomValidity(customValidity)
      }
    }

    if (validity.valid === false) {
      if (title && validity.patternMismatch) {
        elm.setCustomValidity(`${elm.validationMessage} ${title}`)
      }

      const classNames = elm.getAttribute('class')
      let key
      if (id && id.includes('input')) {
        key = id.replace('input.', '')
      }
      if (classNames && classNames.includes('input.')) {
        const targetClassName = classNames.split(' ').filter(cn => cn.includes('input.'))[0]
        key = targetClassName.replace('input.', '')
      }
      if (key) {
        setError({ [key]: elm.validationMessage }, cls.setState.bind(cls))
      }
    }
  })

  const allValid = form.checkValidity()
  form.classList.add('was-validated')
  return allValid
}

export {
  setInput,
  setError,
  newValues,
  substance,
  hasDefault,
  isFormValidAndSetErrors,
}
