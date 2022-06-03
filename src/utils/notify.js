import { ElNotification } from 'element-plus'

export const notify = (options) => {
  return ElNotification({
    title: 'Nutbox',
    duration: options.duration || 3000,
    customClass: `c-notification c-notification-${options.type || 'info'}`,
    ...options
  })
}
