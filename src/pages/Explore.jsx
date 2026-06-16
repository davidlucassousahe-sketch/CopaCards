import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, UserPlus, UserCheck, MessageCircle, Search, Compass } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function Explore() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [followingIds, setFollowingIds] = useState(new Set())

  useEffect(() => {
    if (user) { fetchUsers(); fetchFollowing() }
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles').select('*').neq('id', user.id)
      .order('created_at', { ascending: false }).limit(50)
    setUsers(data || [])
    setLoading(false)
  }

  const fetchFollowing = async () => {
    const { data } = await supabase
      .from('follows').select('following_id').eq('follower_id', user.id)
    setFollowingIds(new Set(data?.map(f => f.following_id) || []))
  }

  const toggleFollow = async (targetUser) => {
    const isFollowing = followingIds.has(targetUser.id)
    if (isFollowing) {
      await supabase.from('follows').delete()
        .eq('follower_id', user.id).eq('following_id', targetUser.id)
      const newSet = new Set(followingIds)
      newSet.delete(targetUser.id)
      setFollowingIds(newSet)
      toast.success(`Deixou de seguir @${targetUser.username}`)
    } else {
      await supabase.from('follows').insert({
        follower_id: user.id, following_id: targetUser.id,
      })
      const newSet = new Set(followingIds)
      newSet.add(targetUser.id)
      setFollowingIds(newSet)
      toast.success(`Seguindo @${targetUser.username}`)
    }
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
          <Compass className="h-3 w-3" />
          Descubra a comunidade
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Explorar</h1>
        <p className="text-muted-foreground mt-1">
          Encontre novos colecionadores para seguir.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou @username..." className="pl-10 h-11" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Nenhum colecionador encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((u) => {
            const isFollowing = followingIds.has(u.id)
            return (
              <Card key={u.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <Link to={`/profile/${u.username}`} className="flex items-center gap-3 hover:opacity-80">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={u.avatar_url} />
                      <AvatarFallback>{u.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{u.full_name || u.username}</p>
                      <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                      {u.favorite_team && (
                        <p className="text-xs mt-0.5">🚩 {u.favorite_team}</p>
                      )}
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <Button size="sm"
                      variant={isFollowing ? 'outline' : 'default'}
                      className={`flex-1 ${!isFollowing ? 'bg-gradient-to-r from-primary to-[#012169] hover:opacity-90' : ''}`}
                      onClick={() => toggleFollow(u)}>
                      {isFollowing ? (
                        <><UserCheck className="h-4 w-4 mr-1" /> Seguindo</>
                      ) : (
                        <><UserPlus className="h-4 w-4 mr-1" /> Seguir</>
                      )}
                    </Button>
                    <Link to={`/chat/${u.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
