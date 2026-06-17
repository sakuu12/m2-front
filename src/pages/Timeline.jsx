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
      <header className="header">
        <h1>タイムライン</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>ログアウト</button>
      </header>
      <div className="container">
        {error && <p className="error">{error}</p>}
        <div className="post-form">
          <form onSubmit={handlePost}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="いまどうしてる？"
              rows={3}
            />
            <div className="post-form-actions">
              <button type="submit" className="btn btn-primary">投稿する</button>
            </div>
          </form>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <p className="author">{post.user?.name}</p>
            <p className="body">{post.body}</p>
            <div className="post-actions">
              <button className="btn" onClick={() => handleLike(post.id)}>
                ❤️ {post.likes?.length}
              </button>
              <button className="btn" onClick={() => fetchComments(post.id)}>
                💬 {post.comments?.length}
              </button>
            </div>
            {comments[post.id] && (
              <div className="comments">
                {comments[post.id].map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <strong>{comment.user?.name}</strong>：{comment.body}
                  </div>
                ))}
                <form className="comment-form" onSubmit={(e) => handleComment(e, post.id)}>
                  <input
                    type="text"
                    value={commentBody[post.id] || ''}
                    onChange={(e) => setCommentBody((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="コメントを入力"
                  />
                  <button type="submit" className="btn btn-primary">送信</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline