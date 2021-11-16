import React, { FC } from 'react'
import {
    Header
} from './styled-components'
import { ThemeProvider } from 'styled-components'
import themes from 'themes'

interface Props {
  title: string
}

const HeaderComponent: FC<Props> = ({ title }) => {
	return <ThemeProvider theme={themes.light}>
		<Header>
			{title}
		</Header>
	</ThemeProvider>
}


export default HeaderComponent