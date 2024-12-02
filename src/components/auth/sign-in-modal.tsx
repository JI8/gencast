"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email)
      setSent(true)
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in",
      })
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Error signing in",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to GenCast</DialogTitle>
          <DialogDescription>
            {sent
              ? "Check your email for the magic link to sign in."
              : "Enter your email to sign in or create an account."}
          </DialogDescription>
        </DialogHeader>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Continue with Email"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSent(false)
                setEmail("")
              }}
            >
              Use a different email
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
