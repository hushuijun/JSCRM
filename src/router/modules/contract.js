// 合同库路由
import Layout from '@/views/layout/ContractLayout'
const a = {
        path: 'rankingContract',
        component: () => import('@/views/ContractLibrary/ContractLibrary/ContractLibrary'),
        meta: {
            title: '合同库',
            icon: 'productstatistics',
        }
}
const ContractLibrary = {
    path: '/contract',
    component: Layout,
    redirect: '/contract/ContractLibrary',
    name: 'contract',
    meta: {
        icon: 'workbench',
        title: '合同库'
    },
    children: [
       a
    ]
}
export default ContractLibrary
export const b = [
        a
  ]