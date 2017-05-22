import Hello from '../components/Hello.vue'
import TransitionDemo from '../components/democompont.vue'

var routes = [
  {
    path: '/hello',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/demo',
    name: 'transition',
    component: TransitionDemo
  }
]

export default routes


