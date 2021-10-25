<template>
    <div>
      <!--面包屑导航--> 
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
       </el-breadcrumb>  

       <!--卡片试图-->
       <el-card >
  
        <!--搜索与添加区域-->
            <el-row :gutter="10">
                <el-col :span='7'>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>

                <el-col :span='4'>
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>

            <!--用户列表区域-->
            <el-table :data="userlist" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop='username'></el-table-column>
                <el-table-column label="邮箱" prop='email'></el-table-column>
                <el-table-column label="电话" prop='mobile'></el-table-column>
                <el-table-column label="角色" prop='role_name'></el-table-column>
                <el-table-column label="状态" prop='mg_state'>
                    <template slot-scope="scope">
                    
                            <el-switch
                                v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                                </el-switch>
                        
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit"
                         @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete"
                         @click="removeUserById(scope.row.id)"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip :enterable='false' effect="dark" content="分配角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting"></el-button>    
      
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页区域-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="30%" @close="addDialogClosed">
            <!--内容主体区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <!--底部区-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改用户的对话框-->
        <el-dialog
            title="修改信息"
            :visible.sync="editDialogVisible"
            width="30%" @close="editDialogClosed">
            <el-form :model="editForm" 
             :rules="editFormRules" 
             ref="editFormRef" label-width="100px" >
                <el-form-item label="用户名" >
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        //验证邮箱的规则
        var checkEmail = (rule,value,cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.text(value)) 
            {return cb()}

            cb(new Error('请输入合法的邮箱'))
        }

        //验证手机号的规则
        var checkMobile = (rule,value,cb) => {
            const regMobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

            if(regMobile.text(value))return cb()

            cb(new Error('请输入合法的手机号'))
        }
       
       
       return {
            //获取用户列表的参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userlist:[],
            total:0,
            //控制添加用户对话框的显示与隐藏
            addDialogVisible:false,

            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,


            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //表单验证规则对象
            addFormRules:{
                username:[
                    {
                        required:true,
                        message:'请输入用户名',
                        trigger:'blur'
                    },
                    {
                        min:3,
                        max:10,
                        message:'长度在三到十之间',
                        trigger:'blur'
                    }
                ],

                password:[
                    {
                        required:true,
                        message:'请输入密码',
                        trigger:'blur'
                    },
                    {
                        min:6,
                        max:20,
                        message:'长度在6-20之间',
                        trigger:'blur'
                    }

                ],

                email:[
                    {
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'
                    }

                ],
                mobile:[
                    {
                        required:true,
                        message:'请输入手机号',
                        trigger:'blur'
                    }

                ]
            },

            //查询到的用户信息对象
            editForm:{},
            //修改表单的验证规则对象
            editFormRules:{
                email:[
                    {
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'
                    }
                ],
                mobile:[
                    {
                        required:true,
                        message:'请输入手机号',
                        trigger:'blur'
                    }
                ]
            }
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('users',{params: this.queryInfo})
            if(res.meta.status !== 200)return this.$message.erroe('获取用户列表失败！')
            else{
                this.userlist=res.data.users
                this.total=res.data.total
            }
            console.log(res)
        },

        //监听 pagesize 改变的事件
        handleSizeChange(newsize){
            //console.log(newsize)
            this.queryInfo.pagesize=newsize
            this.getUserList()
        },
        //监听 pagenum 的改变
        handleCurrentChange(newPage){
            //console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },

        //监听 switch 开关状态的改变
        async userStateChange(useinfo){
            console.log(useinfo)
            const {data:res} = await this.$http.put(`users/${useinfo.id}/state/${useinfo.mg_state}`)
            if (res.meta.status !== 200){
                useinfo.mg_state = !useinfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')  
        },

        //监听用户对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },

        //点击按钮添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return
                //可以发起添加用户的网络请求
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status !==201) {
                    this.$message.error('添加用户失败！')
                }

                this.$message.success('添加用户成功！')
                //隐藏添加用户的对话框
                this.addDialogVisible=false
            })
        },

        //展示编辑用户的对话框
        async showEditDialog(id){
            //console.log(id)
            const {data:res} = await this.$http.get('users/'+id) 
            if(res.meta.status !== 200){
                return this.$message.error('获取用户信息失败！')
            }
            console.log(res.data)
            this.editForm = res.data
            this.editDialogVisible = true
        },

        //监听修改用户对话框的关闭事件
        editDialogClosed(){
            //this.$refs.editFornRef.resetFields()
        },

        //修改用户信息并提交
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                //发起修改用户信息的请求
                const {data:res}= await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                })
                
                if(res.meta.status !== 200){
                    return this.$message.error('更新失败！')
                }

                //关闭对话框
                this.editDialogVisible = false
                //刷新数据列表
                this.getUserList()
                //提示修改成功
                this.$message.success('更新用户数据成功')
            })
        },

        //根据 id 删除对应的用户信息
        async removeUserById(id){
            //弹框询问用户
           const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .catch(err => err)

            if(res !== 'confirm'){
                return this.$message.info('已取消删除')
            }

            const {data:ress} = await this.$http.delete('users/'+id)
            if(ress.meta.status !== 200){
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getUserList()
        }
    }
}
</script>
<style scoped>
    
</style>