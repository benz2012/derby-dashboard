const dataFetch = url => (
  fetch(url, {
    headers: new Headers({
      'sent-from-client-javascript': true,
    }),
  }).then(res => res.json())
)

const embedURL = (src) => {
  const id = src.match(/v=(.+)/)[1]
  if (!id) { return null }
  return `https://www.youtube.com/embed/${id}?rel=0`
}

export {
  dataFetch,
  embedURL,
}
