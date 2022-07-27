import { ElNotification } from 'element-plus'
import { ERR_CODE } from '@/config'

export const notify = (options) => {
  return ElNotification({
    title: 'Nutbox',
    duration: options.duration || 3000,
    customClass: `c-notification c-notification-${options.type || 'info'}`,
    ...options
  })
}

export const showError = (code) => {
  const message = ERR_CODE[code]
  return ElNotification({
    title: 'Nutbox',
    duration: 3000,
    customClass: `c-notification c-notification-error`,
    message
  })
}