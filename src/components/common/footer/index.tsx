import React, { FC } from 'react'

import {
	FooterComponent
	// @ts-ignore
} from './styled-components.tsx'
import Icons from 'icons'

import { ThemeProvider } from 'styled-components'
import themes from 'themes'

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
	return <ThemeProvider theme={themes.light}>
		<FooterComponent>
			Powered by <span><Icons.LinkdropLogo /></span>
		</FooterComponent>
	</ThemeProvider>
}

export default Footer