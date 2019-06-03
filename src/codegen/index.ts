import * as path from 'path'
import {PluginFunction, PluginValidateFn} from '@graphql-codegen/plugin-helpers';
import {OperationDefinitionNode} from "graphql"

export const plugin: PluginFunction = async (schema, documents, config, info) => {
    const mappedDocuments: {[key: string]: OperationDefinitionNode[]} = documents.reduce((previous, document) => {
        const fileName = document.filePath;

        const definitions = document.content.definitions.filter((document) => document.kind === 'OperationDefinition')

        if (definitions.length > 0) {
            if (!previous[fileName])
                previous[fileName] = [];

            previous[fileName].push(...definitions);
        }

        return previous;
    }, {});

    const imports = Object.keys(mappedDocuments)
        .map(documentFile => {
            const operations = mappedDocuments[documentFile]

            const outputFile = info.outputFile
            const outputDirectory = path.dirname(outputFile)

            const relativePath = path.relative(outputDirectory, documentFile)

            const operationsImport = operations.map(op => op.name.value).join(',')

            return `import {${operationsImport}} from "${relativePath}"`
        }).join('\n')


    const definition =  Object.keys(mappedDocuments).map(val => mappedDocuments[val])
        .reduce((previous, definitions) => {
            definitions.forEach(definition => {
                previous[definition.operation].push(`${definition.name.value}: ${definition.name.value}`)
            })

            return previous
        }, {query: [], mutation: [], subscription: []})

    const injectDefinition = `export const GraphQLInjectDefinition = {
        queries: {${definition['query'].join(',\n')}},
        mutations: {${definition['mutation'].join(',\n')}},
        subscriptions: {${definition['subscription'].join(',\n')}}
    }`

    const typeDefinition = `declare module 'vue/types/vue' {
        interface Vue {
            $gql: typeof GraphQLInjectDefinition
        }
    }`

    return imports + '\n' + injectDefinition + '\n' + typeDefinition
}

export const validate: PluginValidateFn<any> = (schema, documents, config, outputFile) => {
    if (!outputFile.endsWith('.ts') || outputFile.endsWith('.d.ts'))
        throw Error(`Plugin "vue-graphql-inject/lib/codegen" requires extension to be ".ts"!`)
}
