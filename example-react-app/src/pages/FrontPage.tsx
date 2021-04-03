import React from 'react'
import styled from 'styled-components'

import { PageHeader } from '../components/PageHeader'

import { MyEditor } from '../editor/Editor'

export const FrontPage = () => {
  return (
    <Container>
      <PageHeader/>
      <MyEditor/>
    </Container>
  )
}

const Container = styled.div`
`
