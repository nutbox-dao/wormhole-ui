import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        text8F: 'var(--text8F)',
        textA6: 'var(--textA6)',
        text53: 'var(--text53)',
        text2C: '#2C2C2C',
        primaryColor: '#EEB134',
        primaryColor1: 'var(--gradient-primary-color1)',
        primaryColor2: 'var(--gradient-primary-color2)',
        primaryColor3: 'var(--gradient-primary-color3)',
        redColor: '#CE395F',
        primaryBg: '#191919',
        dialogBg: '#131313',
        headerBorder: '#323436',
        blockBg: '#2C2C2C',
        dividerColor: '#696969',
        listBgBorder: '#323436',
        color1E: '#1E1E1E',
        color73: '#737373',
        colorD8: '#D8D8D8',
        colorDD: '#DDDDDD',
        colorB6: '#B6B6B6B2',
        colorE3: '#E3E3E3'
      },
      screens: {
        '2md': { min: '961px' },
      },
    }
  }
})
