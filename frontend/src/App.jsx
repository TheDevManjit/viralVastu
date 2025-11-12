import React from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailSend from './pages/VarifyEmailSend'
import EmailVarificationPage from './pages/EmailVarificationPage'
import { Footer } from './components/Footer'
import Profile from './components/Profile'





const router = createBrowserRouter([
  {
    path:'/',
    element:<><Navbar /> <HomePage /> <Footer />
    </>
  },
  {
    path:'/signup',
    element:<> <SignupPage />
    </>
  },
  {
    path:'/login',
    element:<> <LoginPage />
    </>
  }
  ,
  {
    path:'/varify',
    element:<> <VerifyEmailSend />
    </>
  },
  {
    path:'/varify/:token',
    element:<> <EmailVarificationPage />
    </>
  },
  {
    path:'/profile/:userId',
    element:<> <Navbar/> <Profile />
    </>
  },
])

function App() {
  

  return (
   <>
   
   <RouterProvider router = {router} />

   </>
  )
}

export default App
