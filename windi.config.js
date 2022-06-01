import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        text8F: 'var(--text8F)',
        textPrimary1: 'var(--gradient-primary-color1)'
      }
    }
  }
})
