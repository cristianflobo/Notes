import Bar from './components/bar/Bar'
import Menu from './components/menu/Menu'
import useApp from './hooks/useApp'

function App(): JSX.Element {
  const { setMenuShow, saveData, menuShow, text } = useApp()
  return (
    <>
      <Bar handleMenu = {setMenuShow} />
      {menuShow ? (
        <Menu />
      ) : (
        <textarea
          onChange={(e) => saveData(e.target.value)}
          value={text}
          className="text-area"
        ></textarea>
      )}
    </>
  )
}

export default App
