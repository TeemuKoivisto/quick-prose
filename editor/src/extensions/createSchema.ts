import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import { Extension } from './Extension'

export function createSchema(extensions: Extension<any>[]) {
  const nodes = extensions.reduce((acc, cur) => [ ...acc, ...cur.nodes], [] as { name: string, node: NodeSpec }[])
  const marks = extensions.reduce((acc, cur) => [ ...acc, ...cur.marks], [] as { name: string, mark: MarkSpec }[])
  return new Schema({
    nodes: nodes.reduce((acc, n) => ({ ...acc, [n.name]: n.node }), {}),
    marks: marks.reduce((acc, m) => ({ ...acc, [m.name]: m.mark }), {}),
  })
}