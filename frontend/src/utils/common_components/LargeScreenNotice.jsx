import React from 'react'
import style from './LargeScreenNotice.module.css'
import { UIStore } from '../store'

const LargeScreenNotice = () => {

const language = UIStore((state)=>state.language)

  return (
    <div className={style.largeScreenContainer}>
      <img src={`/images/small_screen.png`}/>
      <p className={style.p}>{language.error_messages.large_screen}</p>
      <footer><a href="https://www.freepik.com/search">Icon by HAJICON</a></footer>
      </div>
  )
}

export default LargeScreenNotice