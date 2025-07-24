import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { UserData } from "./contexts/UserContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import { Loading } from "./components/Loading"
import Create from "./pages/Create"
import Account from "./pages/Account"
import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import { Toaster } from "react-hot-toast";
import UpdateAccount from "./pages/UpdateAccount"
import PinPage from "./pages/PinPage"
import Saved from "./pages/Saved"
import Owner from "./pages/Owner"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"


 

function App() {
  const { user,loading } = UserData()

  if(loading) return <Loading/>;
  return (
    <>
      <BrowserRouter>
       <ScrollToTop />
      <Toaster position="top-center" />
      <Navbar user={user} /> 
        <Routes>
          <Route path="/login" element={ <PublicRoute><Login/></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Home user={user} /></ProtectedRoute>}  />
          <Route path="/create" element={<ProtectedRoute><Create/></ProtectedRoute>}  />
          <Route path="/account" element={<ProtectedRoute><Account user={user} /></ProtectedRoute>}  />
          <Route path="/owner/:id" element={<ProtectedRoute><Owner/></ProtectedRoute>}  />
          <Route path="/update" element={<ProtectedRoute><UpdateAccount/></ProtectedRoute>}  />
         <Route path="/pinpage/:id" element={<ProtectedRoute><PinPage/></ProtectedRoute>}  />
          <Route path="/saved" element={<ProtectedRoute><Saved/></ProtectedRoute>}  />
        </Routes>
      <Footer/>
        <ScrollToTop />
      </BrowserRouter>
    </>
  )
}

export default App
