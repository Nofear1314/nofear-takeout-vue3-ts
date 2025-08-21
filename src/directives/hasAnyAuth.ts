import { Permission } from "@/enums";
import { useAdminStore } from "@/stores/modules/admin"
import type { Directive, DirectiveBinding } from 'vue';


/**
 * 权限指令（满足任意一个权限即可）
 */
const hasAuth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<AdminInfo['permissions']>) {
    // 获取指令绑定值（如 ['admin', 'editor']）
    const requiredPermissions = binding.value;

    // 从 Pinia Store 或 localStorage 中获取用户权限（建议使用 Store）
    const adminStore = useAdminStore();
    const permissions = adminStore.getPermissions || []; // 假设 roles 是权限数组

    // 类型断言：确保 requiredPermissions 是数组
    if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
      console.warn('v-hasAuth 指令需要传入权限数组');
      el.parentNode && el.parentNode.removeChild(el) // 删除无权限元素
      return;
    }

    // 权限校验逻辑（示例：检查用户是否包含任意一个所需权限）
    const hasPermission = permissions.some(permission =>
      // 如果为 Permission.ALL_PERMISSION，则表示拥有所有权限
      requiredPermissions.includes(permission) || Permission.ALL_PERMISSION == permission
    );

    // 无权限时删除元素
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

export default hasAuth;
