class WebSocketService {
  /**
   * WebSocket 实例
   */
  private ws: WebSocket | null = null
  /**
   * WebSocket 服务器地址
   */
  private baseUrl: string = 'ws://localhost:9527/ws/'
  /**
   * 存储事件回调函数的对象
   */
  private callbacks: { [event: string]: Array<(data: any) => void> } = {}
  /**
   * 标识是否正在重连的布尔值
   */
  private reconnecting: boolean = false
  /**
   * 重连的间隔时间，单位毫秒,默认5秒
   */
  private reconnectInterval: number = 5000
  /**
   * 最大重连次数，默认3次
   */
  private maxReconnects: number = 3
  /**
   * 当前重连次数
   */
  private reconnectCount: number = 0

  /**
   * 心跳检测定时器
   */
  private heartbeatTimer: number | null = null
  /**
   * 心跳超时定时器
   */
  private heartbeatTimeoutTimer: number | null = null
  /**
   * 心跳间隔时间（毫秒）
   */
  private heartbeatInterval: number = 1000 // 10秒

  /**
   * 心跳超时时间（毫秒）
   */
  private heartbeatTimeout: number = 3000 // 10秒
  /**
   * 是否已连接上
   */
  private isConnected: boolean = false

  // 连接WebSocket
  connect(): Promise<WebSocket> | undefined {
    if (this.isConnected) {
      console.log('已经连接，无需重复连接')
      return Promise.resolve(this.ws!)
    }

    console.log('开始连接WebSocket')
    const token = localStorage.getItem('token')
    // const token = localStorage.getItem('token')
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve(this.ws)
    }

    // if (this.reconnecting) {
    //   return undefined
    // }

    return new Promise<WebSocket>((resolve, reject) => {
      const fullUrl = this.baseUrl + token
      this.ws = new WebSocket(fullUrl)

      this.ws.onopen = (event: Event) => {
        console.log('WebSocket连接已建立', event)
        this.reconnectCount = 0
        this.isConnected = true
        // 启动心跳检测
        this.startHeartbeat()
        resolve(this.ws as WebSocket)
      }

      this.ws.onmessage = (event: MessageEvent) => {
        this.handleMessage(event.data)
      }

      this.ws.onclose = (event: CloseEvent) => {
        console.log('WebSocket连接已关闭', event)
        // 停止心跳检测
        this.stopHeartbeat()
        this.isConnected = false
        this.handleClose(event)
        reject(event)
      }

      this.ws.onerror = (event: Event) => {
        console.error('WebSocket错误', event)
        // 停止心跳检测
        this.stopHeartbeat()
        this.isConnected = false
        this.handleError(event)
        reject(event)
      }
    })
  }
  // 启动心跳检测
  private startHeartbeat(): void {
    this.stopHeartbeat() // 先清除之前的心跳定时器

    // 设置心跳超时检测
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('心跳超时，准备重连')
      this.handleHeartbeatTimeout()
    }, this.heartbeatTimeout)
    // 定期发送心跳包
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // 发送心跳消息
        this.send('ping')
        console.log('发送心跳包')
      }
    }, this.heartbeatInterval)
  }
  // 处理心跳超时
  private handleHeartbeatTimeout(): void {
    console.warn('WebSocket心跳超时，准备重连')
    if (this.ws) {
      this.ws.close()
      this.startReconnect()
    }
  }

  // 停止心跳检测
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  // 重置心跳超时定时器
  private resetHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
    }
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('心跳超时，准备重连')
      this.handleHeartbeatTimeout()
    }, this.heartbeatTimeout)
  }

  // 处理接收到的消息
  private handleMessage(message: string): void {
    // 重置心跳超时定时器
    this.resetHeartbeatTimeout()

    // 如果是心跳响应消息，则直接返回
    if (message === 'pong') {
      console.log('收到心跳响应')
      return
    }
    try {
      const parsedMessage = JSON.parse(message)

      const { event, data } = parsedMessage

      if (this.callbacks[event]) {
        this.callbacks[event].forEach((callback) => callback(data))
      }
    } catch (error) {
      console.error('解析WebSocket消息失败', error, message)
    }
  }

  // 处理连接关闭
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket连接已关闭,准备备重新连接...')
    if (this.reconnecting || event.wasClean) {
      return
    }
    this.startReconnect()
  }

  // 处理错误
  private handleError(event: Event): void {
    console.error('WebSocket错误', event)
    this.startReconnect()
  }

  // 开始重连
  private startReconnect(): void {
    if (this.reconnectCount >= this.maxReconnects) {
      console.log('WebSocket重连次数已达到最大值，不再重连')
      return
    }

    // 如果已经在重连中，则不再重复重连
    if (this.reconnecting) {
      return
    }

    this.reconnecting = true
    this.reconnectCount++

    console.log(
      `WebSocket将在${this.reconnectInterval / 1000}秒后重连，第${this.reconnectCount}/${this.maxReconnects}次尝试`
    )

    setTimeout(() => {
      this.connect()
        ?.then(() => {
          console.log('WebSocket重连成功')
          this.reconnecting = false
        })
        .catch((err) => {
          console.error('WebSocket重连失败', err)
          this.reconnecting = false
          // 可通知全局错误处理
        })
    }, this.reconnectInterval)
  }

  // 注册事件回调
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
    return () => {
      this.callbacks[event] = this.callbacks[event].filter(
        (cb) => cb !== callback
      )
    }
  }

  // 发送消息
  send(message: string | object): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      this.ws.send(message)
      return true
    }
    console.warn('WebSocket未连接，无法发送消息')
    return false
  }

  // 关闭连接
  close(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.reconnecting = false
    }
  }
}

// 导出单例实例
const webSocketService = new WebSocketService()
export default webSocketService
