export default {
  menus: {
    '/': '首页',
    home: '首页',
    UserManage: '用户管理',
     roleManage: '角色管理',
    menuManage: '菜单管理',
    sysManage:'系统管理',
    users: '用户列表',
    roles: '角色列表',
    AuthorityManagement: '权限管理',
    rights: '权限列表',
    GoodsManager: '商品管理',
    GoodsCategory: '商品类目',
    GoodsParameter: '商品参数',
    goods: '商品列表',
    params: '分类参数',
    categories: '商品分类',
    OrderManagement: '订单管理',
    orders: '订单列表',
    reports: '数据报表',
    PersonalData: '个人资料',
    ChangePassword: '修改密码'
  },
  login: {
    title: '用户登录',
    btnTitle: '登录'
  },
  dialog: {
    deleteTitle: '确定要删除用户'
  },
  table: {
    username: '姓名',
    email: '邮箱',
    mobile: '手机',
    role_name: '角色',
    mg_state: '状态',
    create_time: '创建时间',
    action: '操作',
    search: '搜索',
    add_user: '添加用户',
    placeholder: '请输入搜索的用户姓名'
  },
  message: {
    updateSuccess: '更新成功'
  },
  driver: {
    doneBtnText: '完成',
    closeBtnText: '关闭',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    guideBtn: '引导按钮',
    hamburgerBtn: '汉堡按钮',
    fullScreen: '全屏按钮'
  },
   header:{
    avatar:{
       data:'个人资料',
       password:'修改密码',
       exit:'退出'
    }
  }
} as const
