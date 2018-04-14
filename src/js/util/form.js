const setInput = (update, setState) => {
  Object.keys(update).forEach((k) => {
    const v = update[k]
    setState(prevState => ({
      input: {
        ...prevState.input,
        [k]: v,
      },
    }))
  })
}

const newValues = (state, input) => (
  Object.keys(input)
    .filter(k => input[k] !== state[k])
    .map(k => ({ [k]: input[k] }))
)

export {
  setInput,
  newValues,
}
