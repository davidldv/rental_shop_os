'use client'

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function LogoutButton() {
  const t = useTranslations('Components.LogoutButton') // Accessing the translations

  return (
    <Button 
      variant="ghost" 
      onClick={() => logout()}
      className="text-muted-foreground hover:text-foreground hover:bg-transparent px-0"
    >
      {t('label')}
    </Button>
  )
}
