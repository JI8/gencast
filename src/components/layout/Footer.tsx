import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-muted-foreground">© 2024 Gencast. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Link href="https://twitter.com/gencast">Twitter</Link>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Link href="https://github.com/gencast">GitHub</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
