<template>
  <create-view :loading="loading"
               :body-style="{ height: '100%'}">
    <flexbox direction="column"
             align="stretch"
             class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;">新建回款</div>
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
                          class="crm-create-item left-field"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  回款编号
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
            <el-input v-model="record.id" :disabled="true" placeholder="自动生成"
                ></el-input>
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" prop="contractNum"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  合同编号
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
            
              <el-input v-model="record.contractNum" style="width: 70%" :disabled="true"
                ></el-input>
               <el-button @click="selectInvoice()" type="primary">选择</el-button>   
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" prop="customerName"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  客户姓名
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
              <el-input  v-model="record.customerName" :disabled="true"  maxlength="36"
                ></el-input>
            </el-form-item>


            <el-form-item
                          class="crm-create-item right-field" prop="numberOfPeriods"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  期数
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
               <el-input  v-model="record.numberOfPeriods"  maxlength="36"
                ></el-input>
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" prop="moneyBackDate"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  回款日期
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
            
             <el-date-picker
              v-model="record.moneyBackDate"  value-format="yyyy-MM-dd"
              type="date" style="width:100%" 
              placeholder="选择日期">
            </el-date-picker>  
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" prop="planBackMoney"
                          style="">
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  计划回款金额
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
              <el-input-number v-model="record.planBackMoney" :max="1000000000" style="width:100%"  show-word-limit
                ></el-input-number>
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" prop="actualBackMoney"
                          >
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  实际回款金额
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
                <el-input-number v-model="record.actualBackMoney" :max="1000000000" style="width:100%"  show-word-limit
                ></el-input-number>
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" prop="moduleName"
                          >
                <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  选择审核模板
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
             <el-input v-model="record.moduleName" :disabled="true" style="width: 70%"
                ></el-input>
                <el-button @click="selectAudit()" type="primary">选择</el-button>    
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" 
                          >
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  汇款方式
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
              <el-select v-model="record.remittanceId" style="width:100%" clearable placeholder="请选择">
                 <el-option
                  v-for="item in remittanceIdNum"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                  >
                </el-option>
               </el-select>   
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" 
                          >
            </el-form-item>

            <el-form-item
                          class="crm-create-item left-field" 
                          >
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  备注
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
              <el-input v-model="record.remarks" type="textarea"   placeholder="请输入内容"
                ></el-input>
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" 
                          >
            </el-form-item>

            <el-form-item v-if="false"
                          class="crm-create-item left-field" 
                          >
              <div slot="label"
                   style="display: inline-block;">
                <div style="margin:5px 0;font-size:12px;word-wrap:break-word;word-break:break-all;">
                  驳回原因
                  <span style="color:#999;">
                  </span>
                </div>
              </div>
              <el-input v-model="record.reason" type="textarea"   placeholder="请输入内容"
                ></el-input>
            </el-form-item>

             <el-form-item
                          class="crm-create-item right-field" 
                          >
            </el-form-item>

            <el-form-item
                          class="crm-create-item right-field" 
                          >
            </el-form-item>

              <el-button style="margin:10px 0px"
                 @click.native="addFile"
                 type="primary">上传附件</el-button>
              <input type="file"
                    id="file"
                    class="rc-head-file"
                    accept="*/*"
                    @change="uploadFile"
                    multiple>

          </el-form>

          <div style="margin: 0px 20px">
             <el-table :data="fileList"
              align="center"
              header-align="center"
              stripe
              style="width: 100%;border: 1px solid #E6E6E6;"
               >
              <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="createUserName" label="上传人"></el-table-column>
              <el-table-column show-overflow-tooltip prop="createTime" :formatter="dateFormat" label="时间"></el-table-column>
              <el-table-column show-overflow-tooltip prop="size" label="大小"></el-table-column>
            <el-table-column label="操作"
                            width="150">
              <template slot-scope="scope">
                <!-- <flexbox justify="center"> -->
                  <el-button type="text"
                            @click.native="handleFile('preview', scope)">预览</el-button>
                  <el-button type="text"
                            @click.native="handleFile('delete', scope)">删除</el-button>
                <!-- </flexbox> -->
              </template>
            </el-table-column>
            </el-table>
            </div>
        </div>


         <div
           class="handle-bar">
        <el-button class="handle-button"
                   @click.native="hidenView">取消</el-button>
        <el-button class="handle-button"
                   type="primary"
                   @click.native="addValidate">保存</el-button>
        
      </div>
        
      </flexbox>
      
    </flexbox>

        <ContractMedal ref="refInvoiceMedal" @getDataContract="getDataContract"></ContractMedal>
            <AuditMedal ref="refAuditMedal" @getDataAudit="getDataAudit"></AuditMedal>

  </create-view>
</template>
<script type="text/javascript">
import CreateView from '@/components/CreateView'
import { addData } from '@/api/jscrm/money/RemittancePlan'
import {remittanceIdNum}from '@/views/jscrm/money/const/const'
import ContractMedal from '@/views/jscrm/components/ContractMedal' // 引入合同medal
import { upload,queryPageFile,download } from '@/api/jscrm/money/file'
import {crmFileDelete} from '@/api/common'
import AuditMedal from '@/views/jscrm/components/AuditMedal' // 引入用户medal
import * as fecha from "element-ui/lib/utils/date"




export default {
  name: 'create-share', // 所有新建效果的view
  components: {
    CreateView,
    ContractMedal,
    AuditMedal,
  },
 
  data() {
    return {
      remittanceIdNum:remittanceIdNum,
      fileList:[],
      record:{
        // "type": 1,
        "contractId": null,
        "contractNum": null,
        "customerId": null,
        "caseName": null,
        "moduleId": null,
        "moduleName": null,
        "handPersonName": null,
        "billNo": null,
        "invoiceMoney": null,
        "invoiceDate": null,
        "handPersonId": 3,
        "caseId": 2,
        "billType": null,
        "id": null,
        "annexId": "",
        "remarks": null
      },
      // 标题展示名称
      loading: false,
      // 自定义字段验证规则
      ruleValidate: {
         contractNum: [
            { required: true, message: '请输入合同编号', trigger: 'blur' },
          ],
           customerName: [
            { required: true, message: '请输入客户姓名', trigger: 'blur' },
            { max: 36, message: '长度在36个字符以下', trigger: 'blur' }
          ],   
           numberOfPeriods: [
            { required: true, message: '请输入期数', trigger: 'blur' },
            { max: 36, message: '长度在36个字符以下', trigger: 'blur' }
          ],   
           moneyBackDate: [
            { required: true, message: '请输入回款日期', trigger: 'blur' },
          ],   
           planBackMoney: [
            { required: true, message: '请输入计划回款金额', trigger: 'blur' },
          ],  
           actualBackMoney: [
            { required: true, message: '请输入实际回款金额', trigger: 'blur' },
          ],         
           moduleName: [
            { required: true, message: '请输入审核模板', trigger: 'blur' },
          ],        
          
          },
     
    }
  },
  filters: {
   
  },
  mounted() {
    document.body.appendChild(this.$el)

  },
  methods: {

    dateFormat(row,column,cellValue){
      return cellValue ? fecha.format(new Date(cellValue),'yyyy-MM-dd'):'';
    },
    
    hidenView() {
      this.$emit('hiden-view')
    },
   
    // 保存数据
    addValidate() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
            this.add(this.record)
        } else {
          this.$message.error('请完善必填信息')
          return false
        }
      })
    },
   
    /** 添加 */
    add(record) {
      this.loading = true
      addData(record)
        .then(res => {
          this.loading = false
          this.hidenView()
          this.$message.success('操作成功')
          // 回到保存成功
          this.$emit('save')
        })
        .catch(() => {
          this.loading = false
        })
    },
    selectInvoice(){
      this.$refs.refInvoiceMedal.visible=true;
    },

    selectAudit(){
      this.$refs.refAuditMedal.visible=true;
    },

    getDataContract(data){
      this.record.contractId = data.contractId;
      this.record.contractNum = data.contractNum;
      this.record.customerName = data.customerName;
    },

    getDataAudit(data){
      this.record.moduleId = data.examineId;
      this.record.moduleName = data.name;
    },


     addFile() {
      document.getElementById('file').click()
    },
     handleFile(type, item) {
      if (type === 'preview') {
        var previewList = this.fileList.map(element => {
          element.url = element.filePath
          return element
        })
        this.$bus.emit('preview-image-bus', {
          index: item.$index,
          data: previewList
        })
      } else if (type === 'delete') {
        this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileDelete({
              id: item.row.fileId
            })
              .then(res => {
                this.getFileList();
                this.$message.success('删除成功')
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } 
    },

    /** 图片选择出发 */
    uploadFile(event) {
      var files = event.target.files
      var self = this
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        // if (file.type.indexOf('image') != -1) {
        var params = {}
        var params = {}
        params.batchId = this.record.annexId;
        params.file = file
        upload(params)
          .then(res => {
            // console.log(res);
            // this.fileList.push(res.data);
            // console.log(this.fileList);
            this.record.annexId = res.batchId;
            this.getFileList();
            this.$message.success('上传成功')
          })
          .catch(() => {})
        // }
      }

      event.target.value = ''
    },

    getFileList() {
      this.loading = true
      queryPageFile(this.record.annexId)
        .then(res => {
          this.fileList = res.data
          this.loading = false
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

.rc-head-file {
  position: absolute;
  top: 0;
  left: 0;
  height: 98px;
  width: 98px;
  opacity: 0;
  z-index: -1;
  cursor: pointer;
}
</style>
