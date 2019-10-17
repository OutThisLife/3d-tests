import { createGlobalStyle } from 'styled-components'
import { key } from 'styled-theme'

export { default as theme } from '../components/theme'

export default createGlobalStyle`
* {
  box-sizing: box-shadow;
}

html, body {
  margin: 0;
}

body {
  background: ${key('bg')}
}
`
