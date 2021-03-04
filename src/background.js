'use strict'

import { app, protocol, BrowserWindow, Menu } from 'electron'
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// 需要全局引用窗口对象，不然会被垃圾回收机制回收
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 最大化窗口
  // win.maximize()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果处于开发模式，则加载dev服务器的url
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    createProtocol('app')
    // 在未开发时加载index.html
    win.loadURL('app://./index.html')
  }

  // 菜单栏 (键盘快捷键)
  let keyBTemplate = [{
    label: 'keyCode',
    submenu: [
      { label: 'devtools', accelerator: 'F12', role: 'toggledevtools' },
      { label: 'fullScreen', accelerator: 'F11', role: 'togglefullscreen' },
      { label: 'refresh', accelerator: 'F5', role: 'reload' },
    ]
  }]
  // 注册菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate(keyBTemplate))

  // 隐藏顶部菜单栏
  // Menu.setApplicationMenu(null)  // menu模块方法控制隐藏
  win.setAutoHideMenuBar(true)   // new BrowserWindow实例方法控制隐藏, 按alt切换隐藏
  
  win.on('closed', () => {
    win = null
  })
}

// 关闭所有窗口后退出
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // 开启vue-devtools
    BrowserWindow.addDevToolsExtension("C:/Users/Admin/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0")
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {  
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
