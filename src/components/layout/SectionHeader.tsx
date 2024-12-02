import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  link?: {
    href: string
    label: string
  }
}

export function SectionHeader({ title, description, link }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {link && (
        <Link href={link.href}>
          <Button variant="ghost" size="sm" className="rounded-full gap-2 group">
            {link.label}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      )}
    </div>
  )
}
