import * as path from 'path'
import {PluginFunction} from '@graphql-codegen/plugin-helpers';

export const plugin: PluginFunction = async (schema, documents, config, info) => {
    const mappedDocuments = documents.reduce((previous, document) => {
        const fileName = document.filePath;

        if (!previous[fileName])
            previous[fileName] = [];

        previous[fileName].push(...document.content.definitions
            .filter((document) => document.kind === 'OperationDefinition'));

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
        }).join('\n') + '\n' + "import {DocumentNode} from 'graphql'"


    const definition = Object.keys(mappedDocuments)
        .map(documentFile => {
            const operations = mappedDocuments[documentFile]

            return operations.map(value => `${value.name.value}: ${value.name.value}`).join(',\n')
        }).join(',\n')

    const typeDefinitionMap = Object.keys(mappedDocuments)
        .map(documentFile => {
            const operations = mappedDocuments[documentFile]

            return operations.map(value => `${value.name.value}: DocumentNode`).join(',\n')
        }).join(',\n')

    const injectDefinition = `export const GraphQLInjectDefinition = {
        ${definition}
    }`

    const typeDefinition = `declare module 'vue/types/vue' {
        interface Vue {
            $gql(): {
                operations: {
                   ${typeDefinitionMap}
                }
            }
        }
    }`

    return imports + '\n' + injectDefinition + '\n' + typeDefinition
}

/*export const validate: PluginValidateFn<any> = async (schema: GraphQLSchema, documents: Types.DocumentFile[], config: any, outputFile: string) => {
    if (!outputFile.endsWith('.d.ts')) {
        throw new Error(`Plugin "typescript-graphql-files-modules" requires extension to be ".d.ts"!`);
    }
};*/
