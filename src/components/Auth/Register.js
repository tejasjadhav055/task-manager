import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../../services/api'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiRegister({ username, password })
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Username may be taken.')
    }
  }

  return (
    <div className='auth-container'>
      <h2>Register</h2>
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
          Register
        </button>
      </form>
      <p className='auth-footer'>
        Already have an account? <a href='/login'>Login</a>
      </p>
    </div>
  )
}

export default Register
