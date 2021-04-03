import { Plugin, PluginKey } from 'prosemirror-state'
import { NodeSpec, MarkSpec } from 'prosemirror-model'
import { NodeView } from 'prosemirror-view'

import { EditorContext } from '@context'

export interface NodeConfig {
  name: string
  node: NodeSpec
}
export interface MarkConfig {
  name: string
  mark: MarkSpec
}
export interface NodeViewConfig {
  name: string
  nodeView: NodeView
}

export class Extension<T> {
  // toolbarComponent: MyToolbarIcon

  ctx: EditorContext
  props: T

  constructor(ctx: EditorContext, props: T) {
    this.ctx = ctx
    this.props = props
  }

  get name() {
    return ''
  }

  get type() {
    return 'extension' as const
  }

  get nodes() : { name: string, node: NodeSpec }[] {
    return []
  }

  get marks() : { name: string, mark: MarkSpec }[] {
    return []
  }

  static get pluginKey() : PluginKey | null {
    return null
  }

  // Plugin state ??? miten...
  // vai siellä PM:in sisällä ja muu paska providerissa?
  get plugins() : { name: string, plugin: () => Plugin }[] {
    return []
  }

  // otherPluginsOptions?
  // pitäis kyllä antaa propsina typeAheadille
  // readonly pluginsOptions = {
  //   typeAhead: {
  //     trigger: '/',
  //     headless: options ? options.headless : undefined,
  //     getItems: (
  //       query,
  //       state,
  //       _tr,
  //       dispatch,
  //     ) => {
  //       const quickInsertState: QuickInsertPluginState = pluginKey.getState(
  //         state,
  //       );
  //       return searchQuickInsertItems(quickInsertState, options)(query);
  //     },
  //     selectItem: (state, item, insert) => {
  //       return (item as QuickInsertItem).action(insert, state);
  //     },
  //   },
  // }

  // toolbarComponent(ctx: EditorContext) {
  //   // onko mahdollista renderöitä konditionaalisesti?
  // }

  // contentComponent({
  //   editorView,
  //   popupsMountPoint,
  //   popupsBoundariesElement,
  //   popupsScrollableElement,
  // }) {
  //   const pluginState = editorView.getPluginState(this.name)
  //   return (
  //     <Component></Component>
  //   )
  // }

  // onCreate(ctx: EditorContext) {
  //   // init collab provider?
  // }

  // // tai onLayoutChange
  // onContextChange() {
  //   // if (ctx.editorLayout === 'mobile')
  //   this.toolbarComponent = <MyMobileToolbarIcon>
  // }

  onPropsChanged(props: T) {
    this.props = props
  }

  onDestroy() {
    // destroy provider
  }
}
