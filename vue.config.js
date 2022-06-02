const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    windicss: {}
  },
  devServer: {
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
      }
    }
  },
  productionSourceMap: false
})
