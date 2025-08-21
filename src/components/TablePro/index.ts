// 辅助函数：创建表格列配置
function createColumns<T extends object>(
  columns: readonly Table.Column<T>[]
): readonly Table.Column<T>[] {
  return columns as readonly Table.Column<T>[];
}
export { createColumns };
