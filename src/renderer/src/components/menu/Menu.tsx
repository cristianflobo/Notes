import useMenu from './useMenu'
import './menu.css'
import trash from '../../assets/images/trash.svg'
import closeEje from '../../assets/images/ojoCerrado.svg'
import openEje from '../../assets/images/ojoAbierto.png'

const Menu = (): JSX.Element => {
  const { changeShow, deleteNote, listNotes } = useMenu()
  console.log(listNotes)
  return (
    <div className='menu-note'>
      <strong>Notes</strong>
      {listNotes?.map((item: IlistNote, i) => 
      <div className='card-note' key={i}>
        <span>{item.text.slice(0, 20)}</span>
        <div>
          <img onClick={() =>deleteNote(item.process)} height={"20px"} src={trash} alt="" />
          <img onClick={()=>changeShow(item.process)} height={"25px"} src={item.show?openEje:closeEje} alt="" />
        </div>
      </div>
      )}
    </div>
  )
}

export default Menu
