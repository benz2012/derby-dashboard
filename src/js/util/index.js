const dataFetch = url => (
  fetch(url, {
    headers: new Headers({
      'sent-from-client-javascript': true,
    }),
  }).then((res) => {
    if (res.ok) { return res }
    throw new Error(`Status ${res.status} is not OK`)
  }).then(res => res.json())
    .catch(err => console.log(`Data Fetch failed for ${url}. Error: ${err.message || err}`))
)

const embedURL = (src) => {
  const id = src.match(/v=(.+)/)[1]
  if (!id) { return null }
  return `https://www.youtube.com/embed/${id}?rel=0`
}

const resolve = (path, obj) => (
  path.split('.').reduce((prev, curr) => (
    prev ? prev[curr] : undefined
  ), obj || self)
)

const objectSort = (objectsList, attribute, compareFunction) => (
  objectsList.sort((objA, objB) => {
    const valueA = resolve(attribute, objA)
    const valueB = resolve(attribute, objB)
    return compareFunction(valueA, valueB)
  })
)

export {
  dataFetch,
  embedURL,
  objectSort,
}
