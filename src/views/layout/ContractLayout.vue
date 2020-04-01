<template>
  <el-container>
    <el-header class="nav-container">
      <navbar :navIndex="navActiveIndex"
              @nav-items-click="navClick"></navbar>
    </el-header>
    <el-container>
      <sidebar :items="children"
                 :addOffset="quickAddOffset"
                 createButtonTitle="快速创建"
                 mainRouter="contract">
          <div slot="add"
               class="quick-add">
            <div class="quick-add-content">
              <p v-for="(item, index) in list"
                 :key="index"
                 @click="addSkip(item)">
                <i class="wukong"
                   :class="'wukong-' + item.icon"></i>
                <span>{{item.label}}</span>
              </p>
            </div>
          </div>
        </sidebar>
      <el-main id="crm-main-container"
               style="padding:15px;">
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import { mapGetters } from 'vuex'
import { b } from '@/router/modules/contract'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapGetters(['navActiveIndex']),
    ...mapGetters(['contract']),
    quickAddOffset() {
      return Math.round(this.list.length / 2) * 25
    }
  },
  data() {
    return {
      children:[],
       list: [
        {
          label: '日志',
          icon: 'log',
          img: require('@/assets/img/add_journal.png')
        },
        {
          label: '审批',
          icon: 'examine',
          img: require('@/assets/img/add_examine.png')
        },
        {
          label: '任务',
          icon: 'task',
          img: require('@/assets/img/add_task.png')
        },
        {
          label: '日程',
          icon: 'schedule',
          img: require('@/assets/img/add_schedule.png')
        },
        {
          label: '公告',
          icon: 'notice',
          img: require('@/assets/img/add_notice.png')
        }
      ],
    }
  },
  methods: {
    navClick(index) {},

    addSkip(item) {
      let type = item.index
      if (type == 'money') {
        type = 'receivables'
      } else if (type == 'clue') {
        type = 'leads'
      }
      this.createCRMType = type
      this.isCreate = true
    },

    /**
     * 获取消息数
     */
    getcrmMessagNum() {
      this.$store
        .dispatch('GetMessageNum')
        .then(res => {})
        .catch(() => {})
    },

    /**
     * 获取客户管理配置信息
     */
    getcrmSettingConfig() {
      this.$store.dispatch('CRMSettingConfig')
    },

    /**
     * 新建客户同时新建联系人
     */
    // 创建数据页面 保存成功
    createSaveSuccess(data) {
      if (data && data.saveAndCreate) {
        if (data.type == 'customer') {
          this.createCRMType = 'contacts'
          this.createActionInfo = {
            type: 'relative',
            crmType: 'customer',
            data: {}
          }
          this.createActionInfo.data['customer'] = data.data
          this.isCreate = true
        }
      }
    }
  },
  created(){
    this.children = b
  }
}
</script>

<style lang="scss" scoped>
@import './styles/common.scss';
.el-container {
  min-height: 0;
}
.aside-container {
  position: relative;
  background-color: #2d3037;
  box-sizing: border-box;
  border-right: solid 1px #e6e6e6;
  overflow: visible;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 1200px;
}
.quick-add {
  height: 178px;
}
.aside-container {
  position: relative;
  background-color: #2d3037;
  box-sizing: border-box;
  border-right: solid 1px #e6e6e6;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 1200px;
}
</style>
