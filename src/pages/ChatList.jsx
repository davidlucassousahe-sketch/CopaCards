import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, MessageCircle, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

export default function ChatList() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user) fetchConversations()
  }, [user])

  const fetchConversations = async () => {
    setLoading(true)
    const { data: messages } = await supabase
      .from('messages').select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!messages) { setLoading(false); return }

    const map = new Map()
    messages.forEach((m) => {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
      if (!map.has(otherId)) map.set(otherId, m)
    })

    const otherIds = [...map.keys()]
    if (otherIds.length === 0) { setConversations([]); setLoading(false); return }

    const { data: profiles } = await supabase
      .from('profiles').select('*').in('id', otherIds)

    const list = otherIds.map(id => ({
      ...(profiles?.find(p => p.id === id) || {}),
      lastMessage: map.get(id),
    }))

    setConversations(list)
    setLoading(false)
  }

  const filtered = conversations.filter(c =>
    c.username?.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <p className="text-muted-foreground mt-1">
          Converse com outros colecionadores em tempo real.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar conversa..." className="pl-10 h-11" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold">Nenhuma conversa ainda</h3>
            <p className="text-sm text-muted-foreground">
              Abra um perfil e clique em "Mensagem" para iniciar uma conversa.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filtered.map((c, i) => (
              <Link key={c.id} to={`/chat/${c.id}`}
                className={`flex items-center gap-3 p-4 hover:bg-accent transition-colors ${i !== 0 ? 'border-t border-border' : ''}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={c.avatar_url} />
                  <AvatarFallback>{c.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{c.full_name || c.username}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(c.lastMessage.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">@{c.username}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {c.lastMessage.sender_id === user.id && <span className="text-primary font-semibold">Você: </span>}
                    {c.lastMessage.content}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
