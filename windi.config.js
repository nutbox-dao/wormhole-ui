import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primaryColor: '#AE88FE',
        primaryColor1: '#7C3AED',
        redColor: '#D40000',
        greenColor: '#36D233',
        orangeColor: '#FF8700',
        primaryBg: '#0D1117',
        primaryBgLight: '#F7F7F9',
        dialogBg: '#131313',
        inputBg: '#161B22',
        headerBorder: 'rgba(132, 131, 145, 0.3)',
        headerBorderLight: '#D6D6D6',
        blockBg: '#161B22',
        dividerColor: 'rgba(132, 131, 145, 0.3)',
        dividerColorLight: 'rgba(132, 131, 145, 0.16)',
        listBgBorder: 'rgba(132, 131, 145, 0.3)',
        listBgBorderLight: 'rgba(0, 0, 0, 0.16)',
        color1E: '#1E1E1E',
        color73: '#737373',
        colorD8: '#D8D8D8',
        colorDD: '#DDDDDD',
        colorB6: '#B6B6B6B2',
        colorE3: '#E3E3E3',
        color8B: '#8B949E',
        color84: '#848391',
        colorB5: '#B5BFD6',
        color0E: '#0E0E0E',
        color7D: '#7D7F88',
        colorF2: '#F2F2F3',
        color46: '#464646',
        colorF4: '#F4F3FD',
        colorE0: '#E0D2FF',
        color62: '#6246EA',
        colorF1: '#F1F1FE',
        color8F: '#8F8F8F',
        colorF7: '#F7F7F9',
        colorD6: '#D6D6D6',
        color17: '#170F49',
        color6F: '#6F6C90',
        colorED: '#EDEDFC',
        colorEE: '#EEB134',
        color19: '#19AF00',
        colorD9: '#D9D9D9',
        blueDark: '#1A1E25'
      },
      screens: {
        '2md': { min: '961px' },
      },
      backgroundImage: theme => ({
        'social-token-box': 'linear-gradient(106.4deg, #AE88FE -6.5%, #923CFF 33.17%, #923CFF 69.85%, #00B2FF 136.44%)',
        'gradient-text-light': 'linear-gradient(96.99deg, #AE88FE -31.47%, #923CFF 55.23%, #00B2FF 147.53%)',
        'purple-text': 'linear-gradient(99.51deg, #CBBEE7 9.03%, #FFFFFF 89.53%)',
        'gradient-btn-purple': 'linear-gradient(96.99deg, rgba(174, 136, 254, 0.1) -31.47%, rgba(146, 60, 255, 0.1) 55.23%, rgba(0, 178, 255, 0.1) 147.53%)',
        'glass': 'linear-gradient(135deg, rgba(0, 0, 0, 0.43) 0%, rgba(174, 174, 174, 0.27) 0.01%, rgba(34, 34, 34, 0.27) 100%)',
        'purple-white': 'linear-gradient(99.51deg, #CBBEE7 9.03%, #FFFFFF 89.53%)',
        'text-color17': 'linear-gradient(99.51deg, #170F49 9.03%, #170F49 89.53%)',
        'gradient-input': 'linear-gradient(94.28deg, #812DE2 0%, #3A49F9 100%)',
        'tag-gradient': 'linear-gradient(135.53deg, #917AFD 2.61%, #6246EA 96.58%)',
        'view-more': 'linear-gradient(180deg, rgba(73, 73, 73, 0) 69.57%, #494949 100%);',
        'card-gradient': 'linear-gradient(95.37deg, #F5F1FF 10.99%, #FFFFFF 93.32%)'
      }),
      boxShadow: theme => ({
        'popper-tip': '0px 5px 34px rgba(67, 67, 67, 0.1)'
      })
    }
  }
})
