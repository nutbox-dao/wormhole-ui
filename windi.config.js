import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        text8F: 'var(--text8F)',
        textA6: 'var(--textA6)',
        primaryColor: '#EEB134',
        primaryColor1: 'var(--gradient-primary-color1)',
        primaryColor2: 'var(--gradient-primary-color2)',
        primaryColor3: 'var(--gradient-primary-color3)',
        redColor: '#F4245E',
        primaryBg: '#000'
      }
    }
  }
})
