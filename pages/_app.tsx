import App from 'next/app'
import { ThemeProvider } from 'styled-components'

import GlobalStyles, { theme } from './_style'

export default class extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <ThemeProvider {...{ theme }}>
        <main>
          <GlobalStyles />
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    )
  }
}
