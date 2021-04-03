import { Plugin } from 'prosemirror-state'
import { Extension } from './Extension'

type ExtPlugin = { name: string, plugin: () => Plugin }

export function createPlugins(extensions: Extension<any>[]) {
  const plugins = extensions.reduce((acc, cur) => [ ...acc, ...cur.plugins], [] as ExtPlugin[])
  return plugins.reduce((acc, p) => ([ ...acc, p.plugin() ]), [] as Plugin[])
}