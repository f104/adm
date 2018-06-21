import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const IndexView = () => import('@/components/index/View.vue')
const CatalogView = () => import('@/components/catalog/CatalogView.vue')
const ChunkView = () => import('@/components/chunk/View.vue')
const EventlogView = () => import('@/components/eventlog/View.vue')
const OfficesList = () => import('@/components/offices/List.vue')
const OfficesOrder = () => import('@/components/offices/Order.vue')
const NotFoundView = () => import('@/components/404/View.vue')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
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
    {
      path: '/eventlog',
      name: 'eventlog',
      component: EventlogView
    },
    {
      path: '/offices/list',
      name: 'officesList',
      component: OfficesList
    },
    {
      path: '/offices/order',
      name: 'officesOrder',
      component: OfficesOrder
    },
    {
      path: '*',
      component: NotFoundView
    },
  ]
})
