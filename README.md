# Vue GraphQL Inject

A simple way to use your GraphQL operations in a type-safe way with Vue!
It uses [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) to generate the types everything.

### Quick start
As this package is dependent on [graphql-code-generator](https://github.com/dotansimha/graphql-code-generator) you may first install it and create a config for it.
[Here](https://github.com/dotansimha/graphql-code-generator#quick-start) is a  guide on how to do that.

As soo as you're ready you can continue to setup this package.
First of all you need to [install it](#setup) with your preferred package manager.

The *graphql-code-generator* plugin can be found under `vue-graphql-inject/lib/codegen`.
You may add a new output file specifically for this plugin. For example: 
```yaml
schema: "http://localhost:3000/graphql"
documents: "**/*.graphql"
generates:
  src/generated/graphql-inject.ts:
    - "vue-graphql-inject/lib/codegen"
```

The next step is to add the `Vue` plugin:
```javascript
import Vue from 'vue'
import { VueGraphQLInject } from 'vue-graphql-inject/lib/vue'
import { GraphQLInjectDefinition } from './generated/graphql-inject.ts'

Vue.use(VueGraphQLInject, { definition: GraphQLInjectDefinition })
```

# Setup
With NPM:
```
$ npm install vue-graphl-inject
```

With Yarn:
```
$ yarn add vue-graphql-inject
```
