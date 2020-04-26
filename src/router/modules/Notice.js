/** 项目管理路由 */
import Layout from '@/views/layout/noticeLayout'

const noticeRouter = {
  path: '/notice',
  component: Layout,
  redirect: '/notice/index',
  name: 'notice',
  hidden: true,
  meta: {
    title: '工作台'
  },
  children: [
    {
        path: 'index',
        component: () => import('@/views/OAManagement/notice/index'),
        meta: {
          title: '公告',
          icon: 'notice'
        }
      },
    {
      path: 'schedule',
      component: () => import('@/views/OAManagement/schedule/index'),
      meta: {
        title: '日程',
        icon: 'schedule'
      }
    },
    {
      path: 'task',
      component: () => import('@/views/OAManagement/task/index'),
      meta: {
        title: '任务',
        icon: 'task'
      }
    },
    
    {
      path: 'journal',
      component: () => import('@/views/OAManagement/journal/index'),
      meta: {
        title: '日志',
        icon: 'log'
      }
    },
    {
      path: 'examine',
      component: () => import('@/views/OAManagement/examine/index'),
      meta: {
        title: '审批',
        icon: 'examine'
      }
    },
    {
      path: 'notice-new',
      component: () => import('@/views/OAManagement/notice/newDialog'),
      hidden: true
    },
    {
      path: 'schedule-new',
      component: () => import('@/views/OAManagement/schedule/components/createSchedule'),
      hidden: true
    },
    // {
    //   path: 'journal-new',
    //   component: () => import('@/views/OAManagement/journal/newDialog')
    // },
    // 通讯录
    {
      path: 'address-book',
      component: () => import('@/views/OAManagement/addressBook/index'),
      meta: {
        title: '通讯录',
        icon: 'address'
      }
    }
  ]
}

export default noticeRouter
