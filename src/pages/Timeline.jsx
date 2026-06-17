import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Timeline() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [body, setBody] = useState('')
  const [commentBody, setCommentBody] = useState({})
  const [comments, setComments] = useState({})
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        setError('投稿の取得に失敗しました。')
      }
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePost = async (e) => {
    e.preventDefault()
    try {
      await api.post('/posts', { body })
      setBody('')
      fetchPosts()
    } catch (err) {
      setError('投稿に失敗しました。')
    }
  }

  const handleLogout = async () => {
    await api.post('/logout')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`)
      fetchPosts()
    } catch (err) {
      setError('いいねに失敗しました。')
    }
  }

  const fetchComments = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`)
      setComments((prev) => ({ ...prev, [postId]: response.data }))
    } catch (err) {
      setError('コメントの取得に失敗しました。')
    }
  }

  const handleComment = async (e, postId) => {
    e.preventDefault()
    try {
      await api.post(`/posts/${postId}/comments`, { body: commentBody[postId] })
      setCommentBody((prev) => ({ ...prev, [postId]: '' }))
      fetchComments(postId)
    } catch (err) {
      setError('コメントに失敗しました。')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>タイムライン</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handlePost}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="いまどうしてる？"
          rows={3}
          style={{ width: '100%' }}
        />
        <button type="submit">投稿する</button>
      </form>
      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
          <p><strong>{post.user?.name}</strong></p>
          <p>{post.body}</p>
          <p>
            <button onClick={() => handleLike(post.id)}>
              ❤️ {post.likes?.length}
            </button>
            　
            <button onClick={() => fetchComments(post.id)}>
              💬 {post.comments?.length}
            </button>
          </p>
          {comments[post.id] && (
            <div style={{ marginTop: '8px', paddingLeft: '16px' }}>
              {comments[post.id].map((comment) => (
                <div key={comment.id} style={{ borderTop: '1px solid #eee', padding: '4px 0' }}>
                  <strong>{comment.user?.name}</strong>：{comment.body}
                </div>
              ))}
              <form onSubmit={(e) => handleComment(e, post.id)}>
                <input
                  type="text"
                  value={commentBody[post.id] || ''}
                  onChange={(e) => setCommentBody((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="コメントを入力"
                />
                <button type="submit">送信</button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Timeline