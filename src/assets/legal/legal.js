const legalContext = require.context(
  '!!file-loader?name=[name].[ext]!.',
  true,
  /\.(html)$/
)

legalContext.keys().forEach(legalContext)
