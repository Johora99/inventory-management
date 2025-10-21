import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import MainLayOut from '../MainLayOut/MainLayOut';
import Home from '../Pages/Home/Home';
import Registration from '../Pages/Registration/Registration';
import Login from '../Pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayOut,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: '/registration',
        Component: Registration
      },
      {
        path: '/login',
        Component: Login
      }
    ]
    
  }
]);