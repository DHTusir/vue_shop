<template>
    <div class='login_container'>
        <div class='login_box'>
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="110px" class='login_form'>
                    <!-- 用户名 -->
                    <el-form-item prop="username" label="账号：">
                        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password" label="密码：">
                        <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btn">
                        <el-button type="primary" round @click="login">登录</el-button>
                      
                        <el-button type="info" round @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                    
                </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //这是登录表单的数据绑定duixiang
            loginForm:{
                username: 'admin',
                password: '123456'
            },
            //这是表单的验证规则对象
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
            
        }
    },
    methods:{
        //点击重置按钮
        resetLoginForm(){
            /* console.log(this) */
            this.$refs.loginFormRef.resetFields()
        },
        login(){
                this.$refs.loginFormRef.validate(async(valid) =>{
                    if(!valid) return;
                    const {data:res} = await this.$http.post("login",this.loginForm)
                    if(res.meta.status !==200) return this.$message.error('登陆失败');
                    this.$message.success('登陆成功')

                    //1. 将登陆成功之后的 token,保存到客户端的 sessionStorage 中
                    //   1.1 项目中除了登录外的其他API接口，必须在登录之后才能访问
                    //   1.2 token 只应该在当前网站打开期间生效，所以 token 保存在 sessionStorage 中
                    
                    sessionStorage.setItem('token', res.data.token)
                    //2. 通过编程式导航跳转到后台主页，路由地址是/home
                    this.$router.push('/home')
                })
            }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box{
        width:450px;
        height: 300px;
        background-color: #fff;
        border-radius: 30px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    

        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px soild #eee;
            border-radius: 50%;
            padding: 10px;
            
            position: absolute;
            left: 50%;
            transform: translate(-50%,-40%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 10%;
                
            }
        }
    }

    .login_form{
        position:absolute;
        bottom: 0;
        width: 83%;
        transform: translate(0,-10%);
    }
    .btn{
        display: flex;
        justify-content: center;
         
        
        
        transform: translate(-5%);
    }

</style>