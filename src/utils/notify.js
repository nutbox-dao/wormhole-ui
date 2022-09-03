import { ElNotification } from 'element-plus'
import $t from 'vue-i18n'

export const notify = (options) => {
  return ElNotification({
    title: 'Wormhole3',
    duration: options.duration || 3000,
    customClass: `c-notification c-notification-${options.type || 'info'}`,
    ...options
  })
}

export const showError = (code) => {
  let message ='';
  if (code === 500 || code === 501) {
    message = $t('err.serverErr')
  }
  return ElNotification({
    title: 'Wormhole3',
    duration: 5000,
    customClass: `c-notification c-notification-error`,
    message
  })
}