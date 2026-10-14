import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import RequestFlow from './components/RequestFlow.vue'
import Steps from './components/Steps.vue'
import { installMotion } from './motion'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('RequestFlow', RequestFlow)
    app.component('Steps', Steps)
    if (typeof window !== 'undefined') installMotion(router)
  },
} satisfies Theme
