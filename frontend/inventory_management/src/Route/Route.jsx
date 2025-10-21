import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import MainLayOut from '../MainLayOut/MainLayOut';
import Home from '../Pages/Home/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayOut,
    children: [
      {
        index: true,
        Component: Home
      }
    ]
    
  }
]);