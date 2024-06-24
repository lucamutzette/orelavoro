import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Firma from './pages/firma.jsx';
import Giugno from './pages/giugno.jsx';
import Luglio from './pages/luglio.jsx';
import Agosto from './pages/agosto.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },

  {
    path: "/firma",
    element: <Firma/>
  },
  {
    path: "/giugno",
    element: <Giugno/>
  },
  {
    path: "/luglio",
    element: <Luglio/>
  },
  {
    path: "/agosto",
    element: <Agosto/>
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
