import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { token, logout } = useAuth()

  return (
    <nav className='navbar'>
      <div className='container'>
        <Link to='/' className='brand'>
          Task Manager
        </Link>
        {token ? (
          <button onClick={logout} className='logout-btn'>
            Logout
          </button>
        ) : (
          <div className='auth-links'>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
