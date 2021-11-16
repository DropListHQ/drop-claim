import React, { FC } from 'react'
// import { functionalActions } from 'decorators'
import { Header, Footer } from 'components/common'
import { Page, MainContent, Content } from './styled-components'
import { ThemeProvider } from 'styled-components'
import themes from 'themes'
import { Scrollbar } from "react-scrollbars-custom";
import { RootState } from 'data/store'
import { connect } from 'react-redux'

interface PageProps {
  account?: string,
  chainId?: number
}
const mapStateToProps = ({
  drop: { step }
}: RootState) => ({
  step
})
type ReduxType = ReturnType<typeof mapStateToProps>

type IDefineTitle = (step: string) => string
const defineTitle: IDefineTitle = step => {
  if (step === 'claiming_finished') { return '🔥 NFT is yours 🔥' }
  if (step === 'claiming_process') { return '' }
  if (step === 'check_eligibility') { return 'Check eligibility' }
  return '🔥 Get token 🔥'
}

const PageComponent: FC<PageProps & ReduxType> = ({ children, step }) => {
  
  return (
    <ThemeProvider theme={themes.light}>
      <Page>
        <MainContent>
          <Header
            title={defineTitle(step)}
          />
          <Content>
            <Scrollbar style={{ width: '100%', height: 'calc(100vh - 68px - 72px)' }}>
              {children}
            </Scrollbar>
          </Content>
          <Footer />
        </MainContent>
      </Page>
    </ThemeProvider>
  );
};


export default connect(mapStateToProps)(PageComponent)
