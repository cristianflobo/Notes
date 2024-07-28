import { useEffect, useState } from 'react'

const useApp = () => {
  const [text, setText] = useState('')
  const [menuShow, setMenuShow] = useState(false)
  useEffect(() => {
    window.electron.ipcRenderer.on('textDataMain', (_event, data) => {
      setText(data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('textDataMain')
    }
  }, [])

  const saveData = (dataText:string) => {
    setText(dataText)
    window.electron.ipcRenderer.send('saveDataMain', dataText)
  }

  return { setMenuShow, saveData, text, menuShow }
}

export default useApp
