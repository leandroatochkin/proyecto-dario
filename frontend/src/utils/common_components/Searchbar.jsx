import React from 'react'
import { UIStore } from '../store'
import { MagnifyingGlass } from '../svg_icons'
import style from './Searchbar.module.css'



const Searchbar = ({handleFunction}) => {

  const language = UIStore((state)=>state.language)


  return (
    <div className={style.searchbarContainer}>
            <input className={style.searchbar} placeholder={language.general_ui_text.search_businesses} onChange={handleFunction}/>
            <span className={style.searchIcon}><MagnifyingGlass/></span>
    </div>
  )
}

export default Searchbar