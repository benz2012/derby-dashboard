/*
This custom function is an add-on for webpack merger that forces the `dev`
loaders in the pipeline to be listed first in the resulting webpack config.
This allows for the `dev` config to specify hot reloading and the `base`
config to specify everything else.
*/

function customizeObject(a, b, key) {
  if (key === 'module') {
    const newRules = []
    a.rules.forEach((rule) => {
      if (rule.test.source.substring(2, 5) === 'jsx') {
        const jsRule = {
          test: rule.test,
          exclude: rule.exclude,
          use: [
            b.rules[0].use[0],
            ...rule.use,
          ],
        }
        newRules.push(jsRule)
      } else {
        newRules.push(rule)
      }
    })
    return { rules: newRules }
  }
  return undefined // Fall back to default merging
}

module.exports = customizeObject
