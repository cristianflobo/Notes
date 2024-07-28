import { app, shell, BrowserWindow, ipcMain , screen  } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let store
let desface = 0
let widthScreen:number
async function initializeStore() {
  const { default: ElectronStore } = await import('electron-store')
  store = new ElectronStore()
}
function getScreen() {
  const { width } = screen.getPrimaryDisplay().workAreaSize
  widthScreen = width
}

const windowsMap = new Map()

function initialNotes(option: string, idData:number) {
  let getNotas = store.get("notes")
  switch (option) {
    case 'inicial':
      if (store.has('notes') && getNotas.length > 0) {
        for (let i = 0; i < getNotas.length; i++) {
          if (getNotas[i].show) createWindow(getNotas[i])
        }
      } else {
        let objetNotes = [{ text: '', process: -1, show: true }]
        store.set('notes', objetNotes)
        createWindow(objetNotes[0])
      }
      break

    case 'new':
      getNotas = store.get('notes')
      getNotas.push({ text: '', process: -1, show: true })
      store.set('notes', getNotas)
      createWindow({ text: '', process: -1, show: true })
      break

    case 'newShow':
      let findShow = getNotas.find(
          (item: IlistNote) => item.show === false && item.process === idData
        )
      createWindow(findShow)
    default:
      break
  }
}
function createWindow(dataNote: IlistNote): void {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    x: (widthScreen -300)/2,
    y:desface,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  windowsMap.set(mainWindow.webContents.getProcessId(), mainWindow)

  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.send('textDataMain', dataNote.text)
    mainWindow.focus()
  });

  let listNotas = store.get('notes').map((item: IlistNote) => {
    if (item.process === dataNote.process) {
      item.process = mainWindow.webContents.getProcessId()
      item.show = true
    }
    return item
  })
  store.set('notes', listNotas)
  desface = 40 + desface
}

ipcMain.on('saveDataMain', (event, data) => {
  let note = store.get('notes')
  let updateText = note.map((item: IlistNote) => {
    if (item.process === event.processId) {
      item.text = data
    }
    return item
  })
  store.set('notes', updateText)
  updateMenuNotes()
})

ipcMain.on('getNotesMain', (event, _data) => {
  event.reply('getNotesRender', store.get('notes'))
})

ipcMain.on('open', (_event, data) => {
  initialNotes(data, -1)
  updateMenuNotes()
})
ipcMain.on('updateTextBug', (_event, data) => {
  initialNotes(data, -1)
  updateMenuNotes()
})

ipcMain.on('changeShow', (_event, data) => {
  let changeShow = store.get('notes')
  if (windowsMap.has(data)) {
    windowsMap.get(data).close()
    windowsMap.delete(data)
    let filterShow = changeShow.filter((item: IlistNote) => item.show === true)
    if (filterShow.length > 1) {
      store.set(
        'notes',
        changeShow.map((item: IlistNote) => {
          if (item.process === data) {
            item.process = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            item.show = false
          }
          return item
        })
      )
    }
  } else {
    initialNotes('newShow', data)
  }
  updateMenuNotes()
})

ipcMain.on('deleteNote', (_event, data) => {
  try {
    windowsMap.get(data).close()
    windowsMap.delete(data)
  } catch (error) {}

  let deleteNote = store.get('notes')
  store.set(
    'notes',
    deleteNote.filter((item: IlistNote) => item.process !== data)
  )
  updateMenuNotes()
})

ipcMain.on('close', (e) => {
  windowsMap.get(e.processId).close()
  windowsMap.delete(e.processId)
})

ipcMain.on('minimizar', (e) => {
  windowsMap.get(e.processId).minimize()
})

function updateMenuNotes() {
  for (const [_key, value] of windowsMap) {
    try {
      value.webContents.send('updateMenuNotes', store.get('notes'))
    } catch (error) {}
  }
}

app.whenReady().then(async () => {
  getScreen()

  await initializeStore()
  initialNotes('inicial', -1)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initialNotes('inicial', -1)
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
