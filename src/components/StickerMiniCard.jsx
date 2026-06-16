import { Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { STATUS_LABELS } from '@/lib/utils'

export default function StickerMiniCard({ sticker, onDelete, onEdit }) {
  const status = STATUS_LABELS[sticker.status]

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted">
          {sticker.image_url ? (
            <img src={sticker.image_url} alt={sticker.athlete_name}
              className="w-full h-full object-contain p-2"
              onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">⚽</div>
          )}
          <Badge
            variant={sticker.status === 'tenho' ? 'green' : sticker.status === 'quero' ? 'yellow' : 'blue'}
            className="absolute top-2 right-2"
          >
            {status.label}
          </Badge>
          {sticker.shirt_number && (
            <div className="absolute bottom-2 left-2 bg-gradient-to-br from-primary to-[#012169] text-primary-foreground rounded-full h-9 w-9 flex items-center justify-center font-bold text-sm shadow-md">
              {sticker.shirt_number}
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{sticker.athlete_name}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {sticker.team}{sticker.position && ` · ${sticker.position}`}
          </p>

          {(onEdit || onDelete) && (
            <div className="flex gap-1 mt-2">
              {onEdit && (
                <Button size="sm" variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => onEdit(sticker)}>
                  <Edit className="h-3 w-3 mr-1" /> Editar
                </Button>
              )}
              {onDelete && (
                <Button size="sm" variant="outline"
                  className="h-7 text-xs hover:text-destructive"
                  onClick={() => onDelete(sticker)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
