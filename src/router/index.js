import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Secrets from '@/components/Secrets'
import NotFoundPages from '@/404/NotFoundPages'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/secrets',
      name: 'Secrets',
      component: Secrets
    },
    {
      path: '*',
      cimponent: NotFoundPages
    }
  ]
})
