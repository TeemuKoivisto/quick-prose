import { EditorState } from 'prosemirror-state'
import { Extension } from '../Extension'

import { blockquote } from './nodes/blockquote'
import { blockQuotePluginFactory } from './pm-plugins/main'
import { blockquotePluginKey, getPluginState } from './pm-plugins/state'
import { keymapPlugin } from './pm-plugins/keymap'

export interface BlockQuoteExtensionProps {}

export class BlockQuoteExtension extends Extension<BlockQuoteExtensionProps> {

  get name() {
    return 'blockquote' as const
  }

  get nodes() {
    return [{ name: 'blockquote', node: blockquote }]
  }

  static get pluginKey() {
    return blockquotePluginKey
  }

  static getPluginState(state: EditorState) {
    getPluginState(state)
  }

  get plugins() {
    return [
      {
        name: 'blockquote',
        plugin: () => blockQuotePluginFactory(this.ctx, this.props),
      },
      { name: 'blockquoteKeyMap', plugin: () => keymapPlugin() },
    ]
  }
}
