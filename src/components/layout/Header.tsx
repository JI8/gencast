"use client"

import * as React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { SignInModal } from "@/components/auth/sign-in-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function Header({ 
  title = "Gencast",
  description,
  children,
  className,
  action
}: HeaderProps) {
  const { user, signOut } = useAuth()
  const [showSignIn, setShowSignIn] = React.useState(false)

  return (
    <>
      <div className={cn("w-full py-6 px-4", className)}>
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-muted rounded-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-lg font-semibold tracking-tight hover:text-primary transition-colors">
                {title}
              </Link>
              {description && (
                <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="rounded-full gap-2">
                    <Plus className="h-4 w-4" />
                    New Gencast
                  </Button>
                  <div className="w-px h-6 bg-border"></div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 transition-transform hover:scale-105 cursor-pointer">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => signOut()}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => setShowSignIn(true)}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)} 
      />
    </>
  )
}
