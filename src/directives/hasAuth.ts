import { Permission } from "@/enums";
import { useAdminStore } from "@/stores/modules/admin"
import type { Directive, DirectiveBinding } from 'vue';


/**
 * 权限指令（要满足全部权限）
 */
const hasAuth: Directive<HTMLElement, AdminInfo['permissions']> = {
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
    // 处理用户拥有所有权限的情况（优先级最高）
    if (permissions.includes(Permission.ALL_PERMISSION)) {
      return; // 直接通过校验，不删除元素
    }

    // 校验用户是否包含所有所需权限（requiredPermissions 是 permissions 的子集）
    const hasPermission = requiredPermissions.every((requiredPerm) =>
      permissions.includes(requiredPerm)
    );

    // 无权限时删除元素
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

export default hasAuth;
