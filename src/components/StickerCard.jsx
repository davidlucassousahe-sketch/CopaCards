import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Trash2, MoreVertical, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { STATUS_LABELS, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loadingComment, setLoadingComment] = useState(false)

  useEffect(() => {
    if (post) {
      fetchLikes()
      fetchComments()
    }
  }, [post])

  const fetchLikes = async () => {
    const { count } = await supabase
      .from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
    setLikesCount(count || 0)

    if (user) {
      const { data } = await supabase
        .from('likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle()
      setLiked(!!data)
    }
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    setComments(data || [])
    setCommentsCount(data?.length || 0)
  }

  const toggleLike = async () => {
    if (!user) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      setLikesCount((c) => c - 1)
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id })
      setLikesCount((c) => c + 1)
    }
    setLiked(!liked)
  }

  const sendComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return
    setLoadingComment(true)
    const { error } = await supabase.from('comments').insert({
      post_id: post.id, user_id: user.id, content: newComment.trim(),
    })
    if (!error) {
      setNewComment('')
      await fetchComments()
      toast.success('Comentário enviado')
    }
    setLoadingComment(false)
  }

  const deleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId)
    fetchComments()
  }

  const deletePost = async () => {
    if (!confirm('Excluir esta postagem?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    toast.success('Postagem excluída')
    if (onDelete) onDelete(post.id)
  }

  const status = post.stickers ? STATUS_LABELS[post.stickers.status] : null
  const isOwner = user?.id === post.user_id

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between p-4">
          <Link
            to={post.profiles?.username ? `/profile/${post.profiles.username}` : '/profile'}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback>
                {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {post.profiles?.full_name || post.profiles?.username || 'Colecionador'}
              </p>
              <p className="text-xs text-muted-foreground">
                @{post.profiles?.username} · {formatDate(post.created_at)}
              </p>
            </div>
          </Link>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={deletePost} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir postagem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Imagem */}
        {post.stickers?.image_url && (
          <div className="relative bg-muted">
            <img src={post.stickers.image_url} alt={post.stickers.athlete_name}
              className="w-full max-h-96 object-contain"
              onError={(e) => { e.target.style.display = 'none' }} />
            {status && (
              <Badge
                variant={post.stickers.status === 'tenho' ? 'green' : post.stickers.status === 'quero' ? 'yellow' : 'blue'}
                className="absolute top-3 right-3"
              >
                {status.label}
              </Badge>
            )}
          </div>
        )}

        {/* Info */}
        {post.stickers && (
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">{post.stickers.athlete_name}</h3>
              {post.stickers.shirt_number && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">#{post.stickers.shirt_number}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>🚩 {post.stickers.team}</span>
              {post.stickers.position && <span>· {post.stickers.position}</span>}
            </div>
            {post.stickers.description && (
              <p className="text-sm mt-2 text-foreground/80 leading-relaxed">
                {post.stickers.description}
              </p>
            )}
          </div>
        )}

        {post.caption && (
          <div className="px-4 py-3 text-sm">
            <span className="font-semibold mr-1">@{post.profiles?.username}</span>
            <span>{post.caption}</span>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-1 px-2 py-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={toggleLike}
            className={liked ? 'text-red-500 hover:text-red-500' : ''}>
            <Heart className={`h-5 w-5 mr-1.5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{likesCount}</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-5 w-5 mr-1.5" />
                <span className="text-xs font-medium">{commentsCount}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comentários</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    Nenhum comentário ainda.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2 group">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={c.profiles?.avatar_url} />
                        <AvatarFallback>{c.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">@{c.profiles?.username}</p>
                          <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                        </div>
                        <p className="text-sm mt-1">{c.content}</p>
                      </div>
                      {user?.id === c.user_id && (
                        <Button variant="ghost" size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={() => deleteComment(c.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendComment} className="flex gap-2 pt-2 border-t">
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..." className="min-h-[40px] max-h-20" />
                <Button type="submit" size="icon" disabled={loadingComment || !newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
