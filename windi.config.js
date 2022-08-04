import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primaryColor: '#AE88FE',
        primaryColor1: 'var(--gradient-primary-color1)',
        primaryColor2: 'var(--gradient-primary-color2)',
        primaryColor3: 'var(--gradient-primary-color3)',
        redColor: '#CE395F',
        primaryBg: '#0D1117',
        dialogBg: '#131313',
        inputBg: '#161B22',
        headerBorder: 'rgba(132, 131, 145, 0.3)',
        blockBg: '#161B22',
        dividerColor: 'rgba(132, 131, 145, 0.3)',
        listBgBorder: '#323436',
        color1E: '#1E1E1E',
        color73: '#737373',
        colorD8: '#D8D8D8',
        colorDD: '#DDDDDD',
        colorB6: '#B6B6B6B2',
        colorE3: '#E3E3E3',
        color8B: '#8B949E',
        color84: '#848391',
        colorB5: '#B5BFD6'
      },
      screens: {
        '2md': { min: '961px' },
      },
    }
  }
})
