import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const CatalogView = () => import('@/components/catalog/CatalogView.vue')
const ChunkView = () => import('@/components/chunk/View.vue')

export default new Router({
  routes: [
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogView
    },
    {
      path: '/chunk',
      name: 'chunk',
      component: ChunkView
    },
  ]
})
