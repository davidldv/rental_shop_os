'use client'

import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      onClick={() => logout()}
      className="text-muted-foreground hover:text-foreground hover:bg-transparent px-0"
    >
      Logout
    </Button>
  )
}
