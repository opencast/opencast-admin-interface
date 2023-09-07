// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { override, addBabelPlugins } = require('customize-cra')

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = override(
    addBabelPlugins(
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-syntax-optional-chaining'
    )
)
