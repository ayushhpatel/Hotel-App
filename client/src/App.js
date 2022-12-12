import React from 'react'
import Navbar from './components/Navbar'
import {BrowserRouter, Route,Routes, Link} from 'react-router-dom'
import Homescreen from './screens/Homescreen'
import Bookingscreen from './screens/Bookingscreen'
import Register from './screens/Register'
import Login from './screens/Login'
import Profilescreen from './screens/Profilescreen'
import Adminscreen from './screens/Adminscreen'
import Landingscreen from './screens/Landingscreen'

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
      <Routes>
      <Route path="/home" exact element={<Homescreen/>} />
      <Route path="/book/:roomid/:fromdate/:todate" exact element={<Bookingscreen/>}></Route>
      <Route path="/register" exact element={<Register/>}></Route>
      <Route path='/login' exact element={<Login/>}></Route>
      <Route path='/profile' exact element={<Profilescreen/>}></Route> 
      <Route path='/admin' exact element={<Adminscreen/>}></Route> 
      <Route path='/' exact element={<Landingscreen/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;