<template>
  <create-view :loading="loading"
               :body-style="{ height: '100%'}">
    <flexbox direction="column"
             align="stretch"
             class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;">修改分润</div>
        <img @click="hidenView"
             class="close"
             src="@/assets/img/task_close.png" />
      </flexbox>
      <flexbox class="crm-create-flex"
               direction="column"
               align="stretch">
        <div
             class="crm-create-body">
          <div class="create-name">基本信息</div>
          <el-form ref="addForm"
                   :model="record"
                   label-position="top"
                   class="crm-create-box"
                   :rules="ruleValidate">
            <el-form-item
                          class="crm-create-item left-field" prop="title"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  标题
                  <span style="color:#999;">
                   
                  </span>
                </div>
              </div>
              <el-input v-model="record.title"
                ></el-input>
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" prop="type"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  类型
                  <span style="color:#999;">
                   
                  </span>
                </div>
              </div>
              <el-select v-model="record.type"  style="width : 100%" clearable placeholder="请选择">
                <el-option
                  key="员工"
                  label="员工"
                  value="员工">
                </el-option>  
                <el-option
                  key="合伙人"
                  label="合伙人"
                  value="合伙人">
                </el-option>  
                <el-option
                  key="商家"
                  label="商家"
                  value="商家">
                </el-option>  
                <el-option
                  key="兼职"
                  label="兼职"
                  value="兼职">
                </el-option>  
               </el-select>  
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" prop="ratio"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  分润占比
                  <span style="color:#999;">
                   
                  </span>
                </div>
              </div>
              <el-input  v-model="record.ratio" 
                ></el-input>
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" prop="state"
                          >
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  状态
                  <span style="color:#999;">
                   
                  </span>
                </div>
              </div>
            
              <el-select v-model="record.state"  style="width : 100%" clearable placeholder="请选择">
                <el-option
                  label="停用"
                  value="0">
                </el-option>  
                <el-option
                  label="启用"
                  value="1">
                </el-option>  
               </el-select> 
            </el-form-item>

          </el-form>
        </div>

         <div
           class="handle-bar">
        <el-button class="handle-button"
                   @click.native="hidenView">取消</el-button>
        <el-button class="handle-button"
                   type="primary"
                   @click.native="updateValidate">保存</el-button>
        
      </div>
        
      </flexbox>
      
    </flexbox>
  </create-view>
</template>
<script type="text/javascript">
import CreateView from '@/components/CreateView'
import { updateData,selectById } from '@/api/jscrm/money/RemittancePlan'


export default {
  name: 'update-share', // 所有新建效果的view
  components: {
    CreateView,
    
  },
  props: {
    // 详情信息
    detailData: Object
  },
  data() {
    return {
      record:{
        state: null,
        title: null,
        type: null,
        ratio: null
      },
      // 标题展示名称
      loading: false,
      // 自定义字段验证规则
      ruleValidate: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { max: 36, message: '长度在36个字符以下', trigger: 'blur' }
          ],
           ratio: [
            { required: true, message: '请输入分润占比', trigger: 'blur' },
            { max: 36, message: '长度在36个字符以下', trigger: 'blur' }
          ],         
          state: [
            { required: true, message: '请选择状态', trigger: 'blur' },
          ],},
     
    }
  },
  filters: {
   
  },
  mounted() {
    document.body.appendChild(this.$el)
    console.log(this.detailData);
    selectById(this.detailData.id)
      .then(res => {
        this.record = res.data;
      })
      .catch(() => {
        this.$message.error('后台异常');
      });
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view')
    },
   
    // 保存数据
    updateValidate() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
            this.update(this.record)
        } else {
          this.$message.error('请完善必填信息')
          return false
        }
      })
    },
   
    /** 添加 */
    update(record) {
      this.loading = true
      updateData(record)
        .then(res => {
          this.loading = false
          this.hidenView()
          this.$message.success('操作成功')
          // 回到保存成功
          this.$emit('update')
        })
        .catch(() => {
          this.loading = false
        })
    },
  },


  
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
<style lang="scss" scoped>

.left-field{
  padding-left: 0px;
   padding-right: 25px;
}

.right-field{
   padding-left: 25px;
  padding-right: 0px;
}


.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
  }
}
.create-name {
  font-size: 12px;
  padding: 0 10px;
  margin-left: 15px;
  margin-bottom: 10px;
  color: #333333;
  border-left: 2px solid #46cdcf;
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}
</style>
