import React from 'react'
import './App.css'

import { createBrowserRouter,RouterProvider,Route,createRoutesFromElements} from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import VerifyEmailSend from './pages/VarifyEmailSend'
import EmailVarificationPage from './pages/EmailVarificationPage'
import Profile from './components/Profile'
import Layout from './Layout'
import ProductsPage from './pages/ProductsPage'






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

     <Route path='' element={<HomePage />}/>
     <Route path='/signup' element={<SignupPage />}/>
     <Route path='/login' element={<LoginPage />}/>
     <Route path='/varify' element={<VerifyEmailSend />}/>
     <Route path='/varify/:token' element={<EmailVarificationPage />}/>
     <Route path='/varify/:token' element={<EmailVarificationPage />}/>
     <Route path='/profile/:userId' element={<Profile />}/>
     <Route path='/product/' element={<ProductsPage />}/>


    </Route>

  )
   
)

function App() {
  

  return (
   <>
   
   <RouterProvider router = {router} />

   </>
  )
}

export default App
