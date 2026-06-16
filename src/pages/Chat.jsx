import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, Send, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn, formatDate } from '@/lib/utils'

export default function Chat() {
  const { userId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user && userId) {
      fetchOtherUser()
      fetchMessages()
      const channel = subscribeMessages()
      return () => { supabase.removeChannel(channel) }
    }
  }, [user, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchOtherUser = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setOtherUser(data)
  }

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages').select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
  }

  const subscribeMessages = () => {
    return supabase.channel(`chat-${user.id}-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id}))`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      }).subscribe()
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')
    await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: userId, content,
    })
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate('/chat')} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.avatar_url} />
          <AvatarFallback>{otherUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{otherUser?.full_name || otherUser?.username}</p>
          <p className="text-xs text-muted-foreground">@{otherUser?.username}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">💬</p>
            <p className="text-sm">Comece a conversa com @{otherUser?.username}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === user.id
            return (
              <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                  isMine
                    ? 'bg-gradient-to-br from-primary to-[#012169] text-primary-foreground rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                )}>
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                  <p className={cn('text-[10px] mt-1 font-medium',
                    isMine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {formatDate(msg.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite uma mensagem..." disabled={sending} />
        <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}
          className="bg-gradient-to-r from-primary to-[#012169] hover:opacity-90 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
