import i18n from '@/i18n'
const t = i18n.global.t
export const steps = [
  {
    element: '#guide', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '引导按钮', // Title on the popover 标题
      description: t('开始',"开始"), // Body of the popover 内容
      showButtons: true, // Do not show control buttons in footer 是否显示按钮
      position: 'left'
    }
  },
  {
    element: '#theme', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '主题切换', // Title on the popover 标题
      description: '你可以选择自己喜欢的主题', // Body of the popover 内容
      showButtons: true, // Do not show control buttons in footer 是否显示按钮
      position: 'left'
    }
  },
  {
    element: '#fullscreen', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '全屏', // Title on the popover 标题
      description: '你可以单击全屏或退出全屏', // Body of the popover 内容
      showButtons: true, // Do not show control buttons in footer 是否显示按钮
      position: 'left'
    }
  },
  {
    element: '#lang', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '语言切换', // Title on the popover 标题
      description: '你可以切换你喜欢的语言', // Body of the popover 内容
      showButtons: true, // Do not show control buttons in footer 是否显示按钮
      position: 'left'
    }
  },
  {
    element: '#avatar', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '头像', // Title on the popover 标题
      description: '这是你的头像，在这你可以退出登录', // Body of the popover 内容
      showButtons: true, // Do not show control buttons in footer 是否显示按钮
      position: 'left'
    }
  },
  {
    element: '#collapse', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '菜单折叠', // Title on the popover 标题
      description: '你可以单击这里折叠或者展开左侧菜单', // Body of the popover 内容
      showButtons: true // Do not show control buttons in footer 是否显示按钮
    }
  },
  {
    element: '#breadcrumb', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '导航菜单', // Title on the popover 标题
      description: '你可以单击跳转', // Body of the popover 内容
      showButtons: true // Do not show control buttons in footer 是否显示按钮
    }
  },
  {
    element: '#tagMenu', // Query selector string or Node to be highlighted 高亮节点选择器
    popover: {
      // There will be no popover if empty or not given 弹窗选项
      className: 'popover-class', // className to wrap this specific step popover in addition to the general className in Driver options 弹窗额外class名
      title: '标签导航', // Title on the popover 标题
      description: '你可以更方便的切换页面', // Body of the popover 内容
      showButtons: true // Do not show control buttons in footer 是否显示按钮
    }
  }
]

// closeBtnText: '关闭', // Text on the close button for this step 关闭按钮文字
// nextBtnText: '下一步', // Next button text for this step 下一步按钮文字
// prevBtnText: '上一步', // Previous button text for this step 上一步按钮文字
// position: 'bottom'
