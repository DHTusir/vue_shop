<template>

  <el-container>
    <el-header>
      <div>
        <img class="tupian" src="..\assets\logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>

      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>

    <!-- 页面主体 -->
      <el-container>
        <!-- 侧边栏-->
        <el-aside :width="isCollapse? '64px':'200px'">
        <!-- 按钮-->
          <div class="toggle-button" @click='toggleCollapse'>三</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff" unique-opened :collapse="isCollapse"
            :collapse-transition='false' :router='true'
            :default-active="activePath">

            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for='item in menulist' :key='item.id'>
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
              <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
                <span>
                  {{item.authName}}
                </span>
              </template>
                
            <!-- 二级菜单 -->
                <el-menu-item :index="'/home/'+subItem.path" 
                v-for="subItem in item.children" 
                :key='subItem.id'
                @click="saveNavState('/home/'+subItem.path)">
              <template slot="title">
              <!-- 图标 -->
                <i class="el-icon-menu"></i>
              <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template></el-menu-item>
              
            </el-submenu> 
          </el-menu>
        </el-aside>
        <!--右侧内容主体-->
        <el-main>
        <!--路由占位符-->
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
    
</template>
<script>
export default {
  data(){
    return{
    //左侧菜单数据
    menulist:[],
    iconsObj:{
      '125':'el-icon-s-custom',
      '103':'el-icon-s-tools',
      '101':'el-icon-s-cooperation',
      '102':'el-icon-s-claim',
      '145':'el-icon-s-data'
    },

    //是否折叠
    isCollapse: false,

    //被激活的链接地址
    activePath:''
    }

  },
  created(){
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods:{
    logout(){
      sessionStorage.clear()
      this.$router.push("/login")
    },
    //获取所有的菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },

    //点击按钮，切换按钮的折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },

    //保存链接的激活状态
    saveNavState(activePath){
      sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
}
</script>
<style lang="less" scoped>
  //el提供的组件中，组件名就是类名
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgb(224, 218, 218);
    font-size: 25px;
    > div {
      display: flex;
      align-items: center;
      span{
        margin-left:15px
      }
    }

  }

  .el-aside{
    background-color: #333744;
    transition: 0.5s;

    .el-menu{
      border-right: none;
    }
  }

  .el-main{
    background-color: #eaedf1;
  }
    
  .el-container{
    height: 100%;
  }

  .tupian{
    height: 60px;
    width: 60px;
  }

  .toggle-button{
    background-color: rgb(36, 38, 48);
    color: rgb(146, 146, 146);
    font-size: 1px;
    text-align: center;
    cursor: pointer;
  }
</style>