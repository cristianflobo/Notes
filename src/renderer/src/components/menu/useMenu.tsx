import { useEffect, useState } from 'react'

const useMenu = () => {
  const [listNotes, setlistNotes] = useState<IlistNote[]>()
  const [changeShowState, setchangeShowState] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('updateMenuNotes', (_event, data) => {
      setlistNotes(data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('updateMenuNotes')
    }
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer.send('getNotesMain')
    window.electron.ipcRenderer.on('getNotesRender', (_event, data) => {
      setlistNotes(data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('getNotesRender')
    }
  }, [changeShowState])

  const changeShow = (process:number) => {
    setchangeShowState((prev)=>!prev)
    window.electron.ipcRenderer.send('changeShow', process) 
  }
  const deleteNote = (process:number) => {
    setchangeShowState((prev)=>!prev)
    window.electron.ipcRenderer.send('deleteNote', process) 
  }

  return {deleteNote, changeShow, listNotes }
}

export default useMenu
