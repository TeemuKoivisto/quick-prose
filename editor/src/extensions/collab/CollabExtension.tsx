import { EditorState } from 'prosemirror-state'
import { collab } from 'prosemirror-collab'

import { Extension } from '../Extension'

import { collabEditPluginFactory } from './pm-plugins/main'
import { collabEditPluginKey, getPluginState } from './pm-plugins/state'

export interface CollabExtensionProps {
  documentId: string
  userId: string
}

export class CollabExtension extends Extension<CollabExtensionProps> {

  get name() {
    return 'collab' as const
  }

  static get pluginKey() {
    return collabEditPluginKey
  }

  static getPluginState(state: EditorState) {
    getPluginState(state)
  }

  get plugins() {
    return [
      { name: 'pmCollab', plugin: () => collab() },
      {
        name: 'collab',
        plugin: () => collabEditPluginFactory(this.ctx, this.props),
      },
    ]
  }

  onPropsChanged(props: CollabExtensionProps) {
    this.props = props
    this.ctx.collabProvider.setConfig(props)
  }
}
