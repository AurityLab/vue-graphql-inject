import _Vue from 'vue'
import {DocumentNode} from "graphql";

interface DefinitionInterface {
    queries: { [key: string]: DocumentNode };
    mutations: { [key: string]: DocumentNode };
    subscriptions: { [key: string]: DocumentNode };
}

export interface VueGraphQLInjectOptions {
    definition: { [key: string]: DocumentNode };
}

export function VueGraphQLInject(Vue: typeof _Vue, options: VueGraphQLInjectOptions): void {
    Vue.prototype.$gql = options.definition
}
