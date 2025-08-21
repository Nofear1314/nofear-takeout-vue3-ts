

declare namespace Table {
  /**
   * 对齐方式
   */
  type Align = 'left' | 'center' | 'right';

  /**
   * 表格大小
   */
  type Size = 'small' | 'default' | 'large';

  /**
   * 表格列类型,index: 标识索引列，select：表示多选框列，default：表示普通列
   */
  type ColumnType = 'index' | 'selection' | 'default' | 'img';


  type TableColumnCtx = import('element-plus').TableColumnCtx;

  type FormSize = 'small' | 'default' | 'large'

  type TagType = 'success' | 'info' | 'warning' | 'danger' | 'primary'




  // 定义一个工具类型，用于从元组中提取搜索字段
  type ExtractSearchFieldsFromTuple<T, C extends readonly Column<T>[]> = {
    [K in C[number]as K extends { search: { el: any } } ? K['prop'] : never]:
    K extends { search: { valueFormat: infer F } }
    ? F extends 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD'
    ? Date | string
    : K extends { search: { el: 'select' } }
    ? K extends { enum: Array<{ value: infer V }> }
    ? V
    : string
    : string
    : K extends { search: { el: 'select' } }
    ? K extends { enum: Array<{ value: infer V }> }
    ? V
    : string
    : string;
  };

  // 定义请求参数类型，接收元组类型的列配置
  type RequestParams<T, C extends readonly Column<T>[]> = {
    pageNum: number;
    pageSize: number;
  } & ExtractSearchFieldsFromTuple<T, C>;


  /**
   * 定义API响应类型
   */
  interface ApiResponse<T> {
    list: T[];
    total: number;
  }

  // 数据请求函数类型
  type RequestApi<T, C extends readonly Column<T>[]> = (params: RequestParams<T, C>) => Promise<ApiResponse<T>>;

  /**
   * 搜索栏配置
   */
  interface SearchConfig {
    /** 搜索框类型 */
    el: 'text' | 'select' | 'date-picker' | 'date-range';
    /** 占位文本 */
    placeholder?: string;
    /**  下拉选项 */
    options?: any[];
    /** 额外的组件属性 */
    props?: Record<string, any>;
    /** 日期格式化 */
    valueFormat?: string;
    /** 同elementPlus的label-width */
    labelWidth?: string;
    /** 用于控制该表单域下组件的默认尺寸,同elementPlus的size */
    size?: FormSize;
  }

  /**
   * 搜索表单配置(el-form标签上的配置)
   */
  interface SearchFormConfig {
    /** 用于控制该表单域下组件的默认尺寸,同elementPlus的size */
    size?: FormSize;
    /** 同elementPlus的label-width */
    labelWidth?: string;
    /** 同elementPlus的inline */
    inline?: boolean;
    /** 搜索按钮文字 */
    searchBtnText?: string;
    /** 搜索按钮中的 labelWidth*/
    searchBtnLabelWidth?: string;
  }

  /**
   * 基础列配置
   */
  interface BaseColumn {
    /**
     * 列的标题
     */
    label: string;
    /**
     * 列的宽度
     */
    width?: string | number;
    /**
     * 列的对齐方式
     */
    align?: Align;
    /**
     * 列是否固定
     */
    fixed?: boolean | 'left' | 'right';
  }

  /**
   * 默认列配置
   */
  interface DefaultColumn<T> extends BaseColumn {
    /**
     * 列的数据字段名称
     */
    prop: (keyof T & string) | 'action';
    /**
     * 列的类型
     */
    type?: 'default' | 'img'
    /**
     * 搜索配置
     */
    search?: SearchConfig;
    /**
     * 自定义插槽名字
     */
    slot?: string;
    /**
     * 自定义 Tooltip 提示内容,可以是一个函数，参数为当前行数据
     * @param row 当前行的数据
     * @returns 返回自定义的列内容
     */
    'tooltip-formatter'?: (row: T) => string;

    /**
     * 当内容过长被隐藏时显示 tooltip
     */
    'show-overflow-tooltip'?: boolean;

    /**
     * 自定义列内容,参数为当前行数据
     * @param row 当前行的数据
     * @returns 展示的内容
     */
    formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index?: number) => string;
    /**
     * 是否可排序
     */
    sortable?: boolean;

    /**
     * 是否必须显示
     */
    mustShow?: boolean;

  }


  /**
   * 定义标签映射类型
   */
  interface EnumMapItem {
    /** 转换前的值 */
    value: any
    /** 展示的文本 */
    label: string
    /** tag类型 */
    type?: TagType
  }

  /**
   * 定义标签映射的列类型
   */
  interface TagColumn<T> extends DefaultColumn<T> {
    type?: 'enum'
    /**
     * 枚举映射配置
     */
    enum?: EnumMapItem[]
    /**
     * 标签主题效果
     */
    enumTagEffect?: 'dark' | 'light' | 'plain'
    /**
     * 标签类型计算函数
     * @param row 当前行的数据
     * @returns 返回标签类型
     */
    tagTypeFn?: (row: T) => TagType
    /**
     * 标签文本计算函数
     * @param row 当前行的数据
     * @returns 返回标签文本
     */
    enumLabelFn?: (row: T) => string
  }


  /**
   * 索引列配置
   */
  interface IndexColumn extends BaseColumn {
    type: 'index';
  }
  /**
   * 多选框列配置
   */
  interface SelectionColumn extends BaseColumn {
    type: 'selection';
  }

  /**
   * 列配置
   */
  type Column<T = any> = DefaultColumn<T> | IndexColumn | SelectionColumn | TagColumn<T>;



  // interface Pagination {
  //   /**
  //    * 当前页码
  //    */
  //   current?: number;
  //   /**
  //    * 每页显示条数
  //    */
  //   pageSize?: number;
  //   /**
  //    * 总条数
  //    */
  //   total?: number;
  //   /**
  //    * 是否显示分页
  //    */
  //   showPagination?: boolean;
  //   /**
  //    * 是否显示总条数
  //    */
  //   showTotal?: boolean;
  // }



  /**
   * 原生分页配置
   */
  type ElPaginationProps = import('element-plus').PaginationProps;

  /**
   * 分页配置
   */
  interface PaginationOptions extends Partial<ElPaginationProps> {
    /**
     * 分页组件对齐方式
     */
    align?: 'left' | 'center' | 'right'
    /**
     * 是否显示分页
     */
    showPagination?: boolean
  }
}


