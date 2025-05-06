'use client'

import { useState } from 'react'
import './card.css'
import custom from './custom.module.css'
import clsx from 'clsx'

export default function Card() {
    const [expanding] = useState(false)
  return (
    <div className={clsx('card', {
        [custom.card]: expanding
    })}>card</div>
  )
}
