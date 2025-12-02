import React from 'react'
import './App.css'

import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailSend from './pages/VarifyEmailSend'
import Profile from './components/Profile'
import Layout from './Layout'
import ProductsPage from './pages/ProductsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage.jsx'
import ChangePassword from './pages/ChangePassword'






// const router = createBrowserRouter([
//   {
//     path:'/',
//     element:<><Navbar /> <HomePage /> <Footer />
//     </>
//   },
//   {
//     path:'/signup',
//     element:<> <SignupPage />
//     </>
//   },
//   {
//     path:'/login',
//     element:<> <LoginPage />
//     </>
//   }
//   ,
//   {
//     path:'/varify',
//     element:<> <VerifyEmailSend />
//     </>
//   },
//   {
//     path:'/varify/:token',
//     element:<> <EmailVarificationPage />
//     </>
//   },
//   {
//     path:'/profile/:userId',
//     element:<> <Navbar/> <Profile />
//     </>
//   },
// ])


const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='/' element={<Layout />}>

      <Route path='' element={<HomePage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/emailsent' element={<VerifyEmailSend />} />
      <Route path='/changepassword/:token' element={<ChangePassword />} />
      
      <Route path='/profile/:userId' element={<Profile />} />
      <Route path='/product/' element={<ProductsPage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='*' element={<h1 className='text-center mt-20 text-3xl'>404 Not Found</h1>} />

    </Route>

  )

)

function App() {


  return (
    <>
      <div className='overflow-y-scroll'>
        <RouterProvider router={router} />
      </div>


    </>
  )
}

export default App
