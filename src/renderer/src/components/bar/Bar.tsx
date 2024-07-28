import './bar.css'
import mas from '../../assets/images/mas.png'
import menos from '../../assets/images/menos.png'
import useBar from './useBar'
import icon from '../../assets/images/icon.svg'

function Bar({ handleMenu}): JSX.Element {
  const { newWindows, miniWindows } = useBar()
  return (
    <div className="bar">
        <img onClick={() =>handleMenu((prev:boolean)=>!prev)} height={'25px'} src={icon} alt="" />
      <div>
        <button className="botones" onClick={() => newWindows()} id="masVentana">
          <img src={mas} alt="" />
        </button>
        <button className="botones" onClick={() => miniWindows()} id="menosVentana">
          <img src={menos} alt="" />
        </button>
      </div>
      <div>

      </div>
    </div>
  )
}

export default Bar
