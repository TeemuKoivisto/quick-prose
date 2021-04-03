import { ExtensionProvider} from './ExtensionProvider'
import { EditorViewProvider } from './EditorViewProvider'
import { PluginsProvider } from './PluginsProvider'
import { PortalProvider } from '@react'
import { AnalyticsProvider } from './analytics/AnalyticsProvider'
import { APIProvider } from './APIProvider'
import { CollabProvider } from './CollabProvider'

export interface IProviders {
  analyticsProvider: AnalyticsProvider
  apiProvider: APIProvider
  collabProvider: CollabProvider
  extensionProvider: ExtensionProvider
  pluginsProvider: PluginsProvider
  portalProvider: PortalProvider
  viewProvider: EditorViewProvider
}

export const createDefaultProviders = () : IProviders => ({
  analyticsProvider: new AnalyticsProvider(),
  apiProvider: new APIProvider(),
  collabProvider: new CollabProvider(),
  extensionProvider: new ExtensionProvider(),
  pluginsProvider: new PluginsProvider(),
  portalProvider: new PortalProvider(),
  viewProvider: new EditorViewProvider(),
})
