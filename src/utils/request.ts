import axios, {
  type AxiosRequestConfig,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from 'axios'
//头部进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

import { useAdminStore } from '@/stores/modules/admin'
import { clearCacheData } from './clearCacheData'


// interface RequestConfig extends AxiosRequestConfig {
//   interceptors?: {
//     requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
//     requestInterceptorsCatch?: (error: any) => any
//     responseInterceptors?: <T = AxiosResponse>(res: T) => T
//     responseInterceptorsCatch?: (error: any) => any
//   }
// }

/**
 * 是否显示加载动画（标记是否还在请求中）
 */
export const loading = customRef((track, trigger) => {
  // 请求的数量.解决并发请求loading提前结束的问题
  let loadingCount = 0
  return {
    get() {
      track()
      return loadingCount > 0
    },
    set(val) {
      val ? loadingCount++ : loadingCount--
      loadingCount = Math.max(loadingCount, 0)
      trigger()
    }

  }
})

/**
 * 请求返回结果
 */
export interface Result<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 请求配置
 */
interface RequestConfig extends AxiosRequestConfig {
  /**
   * 是否显示全屏加载动画
   */
  fullLoading?: boolean
}

/**
 * 请求类
 */
class Request {

  private adminStoreGetter = () => useAdminStore();
  /** axios实例 */
  instance: AxiosInstance;


  //  基础配置
  private baseConfig: RequestConfig = {
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true,
    timeoutErrorMessage: '请求超时,请稍后重试',
    // 是否显示全屏加载动画，默认不显示，使用顶部进度条，如果启用则不使用顶部进度条
    fullLoading: false,
  }

  constructor(config: RequestConfig = this.baseConfig, private routerInstance?: ReturnType<typeof useRouter>) {
    this.baseConfig = { ...this.baseConfig, ...config }
    this.instance = axios.create(this.baseConfig)
    this.instance.request({})

    /** 请求拦截器 */
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig & { fullLoading?: boolean }) => {

        //  添加进度条
        this.addLoading(config)
        // 在请求拦截里面加token，用于后端的验证
        const token = this.adminStoreGetter().getToken()
        if (token) {
          config.headers[import.meta.env.VITE_APP_AUTHORIZATION_KEY] = token;
        }

        return config
      },
    )


    /** 响应拦截器 */
    this.instance.interceptors.response.use(
      <T = Result>(response: AxiosResponse): AxiosResponse<Result> => {

        const { data, config } = response

        //  关闭进度条
        this.closeLoading(config)

        // 处理错误码
        this.handleErrServiceCode(data)

        return response.data ? response.data : response
      },
      (error: AxiosError) => {

        //关闭loading
        this.closeLoading(error.config as InternalAxiosRequestConfig & { fullLoading?: boolean })
        // 响应错误处理
        this.handleResponseErr(error)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 添加加载动画
   */
  private addLoading(config: InternalAxiosRequestConfig & { fullLoading?: boolean }) {
    //  标记为true（请求数量加1）
    loading.value = true
    // 开启进度条,默认使用顶部进度条
    this.baseConfig.fullLoading || config.fullLoading ? ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    }) :
      Nprogress.start()

  }
  /**
   * 关闭加载动画
   */
  private closeLoading(config: InternalAxiosRequestConfig & { fullLoading?: boolean }) {
    // 标记为false（请求数量减1）
    loading.value = false

    //  请求数量为0时关闭进度条.解决并发请求loading提前结束的问题
    if (!loading.value) {
      // 关闭进度条,默认使用顶部进度条
      this.baseConfig.fullLoading || config.fullLoading ? ElLoading.service().close() :
        Nprogress.done()
    }
  }

  // 添加路由实例，之所以这样传参进来是为了消除控制台的警告
  public setRouter(router: ReturnType<typeof useRouter>): void {
    this.routerInstance = router
  }

  /**
   * 处理业务错误码 （与后端约定好的）
   * @param code 错误码
   * @param message 错误信息
   */
  private handleErrServiceCode({ code, message }: Result): void {
    switch (code) {
      case 401:
        ElMessage.error(message || '登录状态失效，请重新登录')
        clearCacheData()
        this.routerInstance!.push('/login')
        break
      case 403:
        ElMessage.error(message || '您没有权限访问该资源')
        break
      case 300:
        ElMessage.error(message || '操作失败，请稍后再试')
        throw new Error(message || '操作失败，请稍后再试')
      case 500:
        ElMessage.error(message || '操作失败，请联系管理员')
        throw new Error(message || '操作失败，请联系管理员')
      default:
        break
    }
  }
  /**
   * 请求方法
   * @param config 请求配置
   * @returns
   */
  public request<T>(config: RequestConfig): Promise<Result<T>> {
    return this.instance.request(config)
  }

  /**
   * get请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns {Promise<T>}
   */
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.get(url, config);
  }


  /**
   * post请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置项
   * @returns {Promise<T>}
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * put请求
   * @param url 请求地址
   * @param data 请求参数
   * @param config 配置项
   * @returns {Promise<T>}
   */
  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }


  /**
   * delete请求
   * @param url 删除地址
   * @param config 配置项
   * @returns {Promise<T>}
   */
  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }

  /**
   * 并发请求 all 方法（自动包装成 Result<T> 数组）
   * @param promises 请求集合
   * @returns
   */
  public all<T = any>(
    promises: Array<Promise<Result<T>>>
  ): Promise<Result<T>[]> {
    return axios.all(promises);
  }

  /**
   * 处理响应错误
   * @param error 错误信息
   */
  private handleResponseErr(error: AxiosError): void {
    let message = "";
    switch (error.response?.status) {
      case 400:
        message = "请求错误(400)";
        break;
      case 401:
        message = "未授权，请重新登录(401)";
        break;
      case 403:
        message = "拒绝访问(403)";
        break;
      case 404:
        message = "请求出错(404)";
        break;
      case 408:
        message = "请求超时(408)";
        break;
      case 500:
        message = "服务器错误(500)";
        break;
      case 501:
        message = "服务未实现(501)";
        break;
      case 502:
        message = "网络错误(502)";
        break;
      case 503:
        message = "服务不可用(503)";
        break;
      case 504:
        message = "网络超时(504)";
        break;
      case 505:
        message = "HTTP版本不受支持(505)";
        break;
      default:
        message = `连接出错(${error.message})!`;
    }

    ElMessage.error(message)
  }

}
const http = new Request({ fullLoading: false })


// type RequestFnType = <T>(config: AxiosRequestConfig) => Promise<Result<T>>
//三种导出内部方法写法
// 1：
// export const request = http.request.bind(http) as <T>(
//   config: AxiosRequestConfig
// ) => Promise<Result<T>>
// 2：
// export const request: RequestFnType = http.request.bind(http)
// 3:
// export const request1: RequestFnType = <T>(config: AxiosRequestConfig): Promise<Result<T>> => http.request<T>(config)

/**
 * 请求方法
 */
export const request = http.request.bind(http) as <T>(
  config: RequestConfig
) => Promise<Result<T>>

/**
 * get请求
 */
export const get = http.get.bind(http) as <T>(
  url: string,
  config?: RequestConfig
) => Promise<Result<T>>

/**
 * post请求
 */
export const post = http.post.bind(http) as <T>(
  url: string,
  data?: any,
  config?: RequestConfig
) => Promise<Result<T>>

/**
 * put请求
 */
export const put = http.put.bind(http) as <T>(
  url: string,
  data?: any,
  config?: RequestConfig
) => Promise<Result<T>>

/**
 * delete请求
 */
export const deleteReq = http.delete.bind(http) as <T>(
  url: string,
  config?: RequestConfig
) => Promise<Result<T>>

/**
 * 并发请求
 */
export const all = http.all.bind(http) as <T>(
  values: Array<Promise<Result<T>>>
) => Promise<Result<T>[]>

export default http
