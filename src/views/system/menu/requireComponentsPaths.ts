/**
 * 页面组件路径集合
 */
let componentsPaths:string[] = []
const modules = import.meta.glob('@/views/**/*.vue');
for (const path in modules) {
  const p = path.split('views/')[1].split('.vue')[0];
  componentsPaths.push(p);
}

export default componentsPaths
