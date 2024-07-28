const useBar = () => {
  const newWindows = () => {
    window.electron.ipcRenderer.send('open', "new")
  }

  const miniWindows = () => {
    window.electron.ipcRenderer.send('minimizar')
  }


  return { newWindows, miniWindows }
}

export default useBar
