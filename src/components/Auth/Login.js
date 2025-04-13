import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../services/api'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await apiLogin({ username, password })
      login(response.data.token)
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className='auth-container'>
      <h2>Login</h2>
      {error && <div className='error-message'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='submit-btn'>
          Login
        </button>
      </form>
      <p className='auth-footer'>
        Don't have an account? <a href='/register'>Register</a>
      </p>
    </div>
  )
}

export default Login
