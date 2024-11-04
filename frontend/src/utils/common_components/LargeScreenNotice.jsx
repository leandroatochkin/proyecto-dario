import React from 'react'
import style from './LargeScreenNotice.module.css'
import { ES_text } from '../text_scripts'

const LargeScreenNotice = () => {
  return (
    <div className={style.largeScreenContainer}>
      <img src={`/images/small_screen.png`}/>
      <p className={style.p}>{ES_text.large_screen}</p>
      <footer><a href="https://www.freepik.com/search">Icon by HAJICON</a></footer>
      </div>
  )
}

export default LargeScreenNotice