import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    VitePWA({ registerType: 'autoUpdate' }),
    viteCommonjs()
  ],
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '~@': path.resolve('src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    process: "process/browser",
    stream: "stream-browserify",
    zlib: "browserify-zlib",
    util: 'util'
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  },
  server: {
    proxy: {
      '/twitter': {
        target: 'https://api.twitter.com',
        changeOrigin: true,
        pathRewrite: {
          '^/twitter': ''
        }
      },
      '/api': {
        target: 'https://www.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/steem': {
        target: 'https://steem.wh3.io',
        changeOrigin: true,
        pathRewrite: {
          '^/steem': ''
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})
