import React, { useMemo } from 'react'

import {
  Editor, ReactEditorContext, PortalRenderer, Base, BlockQuote,
  EditorContext, createDefaultProviders
} from '@quick-prose/editor'

import { FullPage } from './FullPage'

export function MyEditor() {
  const providers = useMemo(() => createDefaultProviders(), [])
  function handleEditorReady(ctx: EditorContext) {
    console.log('ready', ctx)
  }
  return (
    <div>
      <ReactEditorContext.Provider value={providers}>
        <FullPage>
          <Editor
            providers={providers}
            onEditorReady={handleEditorReady}
          >
            <Base/>
            <BlockQuote />
          </Editor>
        </FullPage>
        <PortalRenderer />
      </ReactEditorContext.Provider>
    </div>
  )
}
