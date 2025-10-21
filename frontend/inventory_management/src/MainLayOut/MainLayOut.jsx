import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainLayOut() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
