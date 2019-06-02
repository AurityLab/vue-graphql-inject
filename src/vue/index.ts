import _Vue from 'vue'
import {DocumentNode} from "graphql";

export interface VueGraphQLInjectOptions {
    definition: { [key: string]: DocumentNode };
}

export function VueGraphQLInject(Vue: typeof _Vue, options: VueGraphQLInjectOptions): void{
    Vue.prototype.$gql = (): { operations: { [key: string]: DocumentNode } } => ({
        operations: options.definition
    })
}
