import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect :'myone',
      component:resolve => require(['@/components/HelloWorld'],resolve)
    },
    {
      path: '/myone',
      name: 'myone',
      component:resolve => require(['@/components/HelloWorld'],resolve)
    },
  ]
})
