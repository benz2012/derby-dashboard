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

const dataSend = (url, method, uid, token, data) => (
  fetch(url, {
    body: JSON.stringify(data),
    headers: new Headers({
      'sent-from-client-javascript': true,
      'Content-Type': 'application/json',
      'auth-uid': uid,
      'auth-token': token,
    }),
    method,
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
    console.log(`Data Send failed for ${url}. Error: ${err.message || err}`)
    throw new Error(err)
  })
)

const embedURL = (src) => {
  const id = src.match(/v=(.+)/)[1]
  if (!id) { return null }
  return `https://www.youtube.com/embed/${id}?rel=0`
}

const resolvePath = (path, obj) => (
  path.split('.').reduce((prev, curr) => (
    prev ? prev[curr] : undefined
  ), obj || self) // eslint-disable-line no-restricted-globals
)

const objectSort = (objectsList, attribute, compareFunction) => (
  objectsList.sort((objA, objB) => {
    const valueA = resolvePath(attribute, objA)
    const valueB = resolvePath(attribute, objB)
    return compareFunction(valueA, valueB)
  })
)

const storageEnabled = () => {
  try {
    localStorage.setItem('_test', 'test')
  } catch (e) {
    return false
  }
  return true
}

const storageSet = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const storageGet = (key) => {
  const value = localStorage.getItem(key)
  return value && JSON.parse(value)
}

export {
  dataFetch,
  dataSend,
  embedURL,
  objectSort,
  storageEnabled,
  storageSet,
  storageGet,
}
