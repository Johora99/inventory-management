import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import MainLayOut from '../MainLayOut/MainLayOut';
import Home from '../Pages/Home/Home';
import Registration from '../Pages/Registration/Registration';
import Login from '../Pages/Login/Login';
import Dashboard from '../Pages/Dashboard/Dashboard';
import MyInventories from '../Pages/Dashboard/UserDashboard/MyInventories';
import DashboardHome from '../Pages/Dashboard/Components/DashboardHome';
import AllUsers from '../Pages/Dashboard/AdminDashboard/AllUsers';
import ManageInventory from '../Pages/Dashboard/AdminDashboard/ManageInventory';
import InventoryDetails from '../Pages/Dashboard/UserDashboard/InventoryDetails';
import AccessInventory from '../Pages/Dashboard/UserDashboard/AccessInventory';

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
    
  },
  {
    path: '/dashboard',
    Component: Dashboard,
    children: [
      {
        index: true,
        Component: DashboardHome
      },
      {
        path: '/dashboard/my-inventories',
        Component: MyInventories
      },
      {
        path: '/dashboard/all-users',
        Component: AllUsers
      },
      {
        path: '/dashboard/manage-inventory',
        Component: ManageInventory
      },
      {
        path: '/dashboard/manage-inventory/:id',
        Component: InventoryDetails
      },
      {
        path: '/dashboard/accessInventory',
        Component: AccessInventory,
      }
    ]
  }
]);