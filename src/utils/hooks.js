import {onUnmounted, ref} from "vue";
export const usePageScroll = () => {
  const scroll = ref(0)
  const pageScroll = (ref) => {
    scroll.value = ref.scrollTop
  }

  const pageScrollTo = (ref) => {
    ref.scrollTo({top: scroll.value})
  }

  const pageScrollToTop = (ref) => {
    ref.scrollTo({top: 0, behavior: 'smooth'})
  }

  return {
    scroll,
    pageScroll,
    pageScrollTo,
    pageScrollToTop
  }
}

export const useTimer = () => {
  const timer = ref(null)
  const setTimer = (cb, delay=0) => {
    timer.value = setTimeout(() => {
      cb()
      clearTimeout(timer.value)
    }, delay)
  }
  onUnmounted(() => {
    clearTimeout(timer.value)
  })
  return {
    setTimer
  }
}
