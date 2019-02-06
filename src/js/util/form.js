const setInput = (update, setState) => {
  Object.keys(update).forEach((k) => {
    const v = update[k]
    if (k.indexOf('.') !== -1) {
      // object of objects, updating
      const k1 = k.split('.')[0]
      const k2 = k.split('.')[1]
      const k3 = k.split('.')[2]
      if (k3) {
        setState(prevState => ({
          input: {
            ...prevState.input,
            [k1]: {
              ...prevState.input[k1],
              [k2]: {
                ...prevState.input[k1][k2],
                [k3]: v,
              },
            },
          },
        }))
      } else {
        setState(prevState => ({
          input: {
            ...prevState.input,
            [k1]: {
              ...prevState.input[k1],
              [k2]: v,
            },
          },
        }))
      }
    } else {
      setState(prevState => ({
        input: {
          ...prevState.input,
          [k]: v,
        },
      }))
    }
  })
}

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

export {
  setInput,
  newValues,
  substance,
}
