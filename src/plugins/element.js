import Vue from 'vue'
import { Button } from 'element-ui'
import { form,FormItem } from 'element-ui'  
import { Input } from 'element-ui'
//导入弹窗提示
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(form)
Vue.use(FormItem)
Vue.use(Input)

//将弹窗组件挂载到vue原型组件上，这样每一个组件都能通过this访问
Vue.prototype.$message = Message
