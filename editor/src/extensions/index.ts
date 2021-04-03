import { createReactExtension } from './createReactExtension'
import { BaseExtension } from './base'
import type { BaseExtensionProps } from './base'
import { BlockQuoteExtension } from './blockquote'
import type { BlockQuoteExtensionProps } from './blockquote'

export const Base = createReactExtension<BaseExtensionProps>(BaseExtension)
export const BlockQuote = createReactExtension<BlockQuoteExtensionProps>(BlockQuoteExtension)
export { BaseExtension } from './base'
export type { BaseState } from './base'
export { BlockQuoteExtension } from './blockquote'
export type { BlockQuoteState } from './blockquote'
export { Extension } from './Extension'

export { createSchema } from './createSchema'
export { createPlugins } from './createPlugins'