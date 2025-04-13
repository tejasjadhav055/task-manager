import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/Layout/PrivateRoute'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import TaskList from './components/Tasks/TaskList'
import Navbar from './components/Layout/Navbar'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/' element={<TaskList />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
