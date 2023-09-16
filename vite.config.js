import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'
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
      resolvers: [
        ElementPlusResolver(),
        VantResolver()
      ]
    }),
    VitePWA({
      // disable: true,
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      devOptions: {
        enabled: true
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html}']
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Wormhole3',
        short_name: 'Wormhole3',
        description: 'Build your influence with a decentralized curation protocol',
        background_color: '#6246EA',
        theme_color: '#6246EA',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
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
    host: '0.0.0.0',
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
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})
