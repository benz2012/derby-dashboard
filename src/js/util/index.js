const dataFetch = url => (
  fetch(url, {
    headers: new Headers({
      'sent-from-client-javascript': true,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Response Status ${res.status}. Expected 200-299.`)
    }
    const contentType = res.headers.get('Content-Type')
    if (!(contentType && contentType.includes('application/json'))) {
      res.text().then((t) => { console.log(t) })
      throw new Error(`Content Type ${contentType}. Expected application/json.`)
    }
    return res.json()
  }).catch((err) => {
    console.log(`Data Fetch failed for ${url}. Error: ${err.message || err}`)
  })
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
