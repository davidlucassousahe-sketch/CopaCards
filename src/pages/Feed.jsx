import { useEffect, useState } from 'react'
import { Loader2, PlusCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import PostCard from '@/components/StickerCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

export default function Feed() {
  const { user, profile } = useAuth()
  const { theme } = useTheme()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) fetchPosts()
  }, [user, filter])

  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select(`
        *,
        stickers (*),
        profiles (username, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter === 'following') {
      const { data: following } = await supabase
        .from('follows').select('following_id').eq('follower_id', user.id)
      const ids = following?.map(f => f.following_id) || []
      ids.push(user.id)
      query = query.in('user_id', ids)
    }

    const { data, error } = await query
    if (!error) setPosts(data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
          <Sparkles className="h-3 w-3" />
          {theme === 'dark' ? 'Modo noturno' : 'Modo claro'}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Colecionador'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe as últimas figurinhas compartilhadas pela comunidade.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              filter === 'all' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('following')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              filter === 'following' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Seguindo
          </button>
        </div>

        <Link to="/sticker/new" className="sm:hidden">
          <Button size="icon"><PlusCircle className="h-4 w-4" /></Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-6xl">📭</p>
            <div>
              <h3 className="font-semibold">Nenhuma postagem ainda</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === 'following'
                  ? 'Siga outros colecionadores para ver postagens.'
                  : 'Seja o primeiro a compartilhar uma figurinha!'}
              </p>
            </div>
            <Link to="/sticker/new">
              <Button className="bg-gradient-to-r from-primary to-[#012169] hover:opacity-90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar figurinha
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post}
              onDelete={(id) => setPosts(posts.filter(p => p.id !== id))} />
          ))}
        </div>
      )}
    </div>
  )
}
