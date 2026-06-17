import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (err) {
      setError('メールアドレスまたはパスワードが正しくありません。')
    }
  }

  return (
    <div className="container">
      <div className="auth-box">
        <h1>ログイン</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">ログイン</button>
        </form>
        <div className="link">
          <Link to="/register">アカウントをお持ちでない方はこちら</Link>
        </div>
      </div>
    </div>
  )
}

export default Login