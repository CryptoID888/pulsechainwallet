// const deduplicateFragmentsPlugin = {
//   name: 'deduplicate-fragments',
//   setup: (config) => {
//     const fragmentSet = new Set()
//     config.generates.forEach((generateConfig) => {
//       generateConfig.imports.forEach((importStatement) => {
//         if (importStatement.fragment) {
//           const fragmentName = importStatement.fragment.name
//           if (!fragmentSet.has(fragmentName)) {
//             fragmentSet.add(fragmentName)
//             // Import the fragment only once
//             importStatement.importStatement = `import { ${fragmentName} } from './gql/${fragmentName}';`
//           }
//         }
//       })
//     })
//   },
// }

module.exports = {
  // Specify the schema URL
  schema: 'https://pulsechainwallet-indexer.up.railway.app',
  target: 'typescript',
  overwrite: true,
  generates: {
    './src/common/indexer/gql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
      plugins: ['typescript-operations'],
    },
  },
}
