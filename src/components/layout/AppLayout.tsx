import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Home, 
  Bot, 
  Wrench,
  Database,
  MessagesSquare,
  Activity,
  BarChart2,
  FileBarChart,
  Settings, 
  Building2,
  Users, 
  CreditCard,
  LifeBuoy,
  BookOpen,
  Headset,
  Bell,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  children?: SidebarItem[]
  requiresRole?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/app/home'
  },
  {
    id: 'ai-agent',
    label: 'AI Agent',
    icon: Bot,
    path: '/app/ai/agent-builder',
    children: [
      { id: 'agent-builder', label: 'Agent Builder', icon: Wrench, path: '/app/ai/agent-builder' },
      { id: 'knowledge-base', label: 'Knowledge Base', icon: Database, path: '/app/ai/knowledge-base' },
      { id: 'conversations', label: 'Conversations', icon: MessagesSquare, path: '/app/ai/conversations' },
      { id: 'evaluate-agent', label: 'Evaluate Agent', icon: Activity, path: '/app/ai/evaluate' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart2,
    path: '/app/analytics/reports',
    children: [
      { id: 'reports', label: 'Reports', icon: FileBarChart, path: '/app/analytics/reports' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/app/settings/users-roles',
    children: [
      { id: 'manage-accounts', label: 'Manage Accounts', icon: Building2, path: '/app/settings/manage-accounts', requiresRole: 'Mio Staff' },
      { id: 'users-permissions', label: 'Manage Users & Permissions', icon: Users, path: '/app/settings/users-roles' },
      { id: 'billing', label: 'Billing & Plan Setup', icon: CreditCard, path: '/app/settings/billing' }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoy,
    path: '/app/support/docs',
    children: [
      { id: 'documentation', label: 'Documentation', icon: BookOpen, path: '/app/support/docs' },
      { id: 'contact-support', label: 'Contact Support', icon: Headset, path: '/app/support/contact' }
    ]
  }
]

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRailExpanded, setIsRailExpanded] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const railRef = useRef<HTMLDivElement>(null)

  // Mock user role - in real app this would come from auth context
  const userRole = 'Admin' // Change to 'Mio Staff' to see manage accounts

  const currentPath = location.pathname

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const pathSegments = currentPath.split('/').filter(Boolean)
    if (pathSegments.length < 2) return 'Home'
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  // Auto-collapse rail after navigation
  useEffect(() => {
    setIsRailExpanded(false)
    setExpandedGroup(null)
  }, [currentPath])

  // Handle rail hover
  const handleRailMouseEnter = () => {
    setIsRailExpanded(true)
  }

  const handleRailMouseLeave = () => {
    setIsRailExpanded(false)
    setExpandedGroup(null)
  }

  // Handle top-level group click
  const handleGroupClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      // If has children, toggle expansion
      if (expandedGroup === item.id) {
        setExpandedGroup(null)
      } else {
        setExpandedGroup(item.id)
        setIsRailExpanded(true)
      }
    } else {
      // If no children, navigate directly
      navigate(item.path)
    }
  }

  // Handle keyboard navigation
  const handleGroupKeyDown = (e: React.KeyboardEvent, item: SidebarItem) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (item.children && item.children.length > 0) {
        setExpandedGroup(expandedGroup === item.id ? null : item.id)
        setIsRailExpanded(true)
      } else {
        navigate(item.path)
      }
    }
  }

  // Filter menu items based on user role
  const getFilteredItems = (items: SidebarItem[]): SidebarItem[] => {
    return items.map(item => ({
      ...item,
      children: item.children?.filter(child => 
        !child.requiresRole || child.requiresRole === userRole
      )
    }))
  }

  const filteredSidebarItems = getFilteredItems(sidebarItems)

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-3 border-b border-surface-stroke">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-brand-accent to-purple-600 p-0.5 flex-shrink-0">
            <img 
              src="/mio-ai-mascot.svg" 
              alt="Mio AI" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {(isMobile || isRailExpanded) && (
            <h1 className="text-lg font-headline font-bold text-high whitespace-nowrap ml-3">
              Mio AI
            </h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-width-none">
        {filteredSidebarItems.map((item) => (
          <div key={item.id} className="relative">
            {/* Main menu item */}
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleGroupClick(item)}
                    onKeyDown={(e) => handleGroupKeyDown(e, item)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-lg motion-curve text-left relative group",
                      "hover:bg-surface-stroke focus:bg-surface-stroke focus:outline-none",
                      currentPath.startsWith(item.path) && "bg-brand-accent/10 border-l-4 border-brand-accent text-brand-accent",
                      isMobile || isRailExpanded ? "space-x-3" : "justify-center"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {(isMobile || isRailExpanded) && (
                      <>
                        <span className="font-medium whitespace-nowrap overflow-hidden">
                          {item.label}
                        </span>
                        {item.children && item.children.length > 0 && (
                          <ChevronRight 
                            className={cn(
                              "w-4 h-4 ml-auto flex-shrink-0 motion-curve",
                              expandedGroup === item.id && "rotate-90"
                            )} 
                          />
                        )}
                      </>
                    )}
                  </button>
                </TooltipTrigger>
                {!isRailExpanded && !isMobile && (
                  <TooltipContent 
                    side="right" 
                    className="bg-surface-01 border-surface-stroke text-text-high z-50"
                    sideOffset={8}
                  >
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            {/* Sub-items (only show when expanded and has children) */}
            {item.children && 
             item.children.length > 0 && 
             expandedGroup === item.id && 
             (isMobile || isRailExpanded) && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((child) => (
                  <TooltipProvider key={child.id} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => navigate(child.path)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg motion-curve text-left text-sm",
                            "hover:bg-surface-stroke focus:bg-surface-stroke focus:outline-none",
                            currentPath === child.path && "bg-brand-accent/10 text-brand-accent"
                          )}
                        >
                          <child.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap overflow-hidden">
                            {child.label}
                          </span>
                        </button>
                      </TooltipTrigger>
                      {!isRailExpanded && !isMobile && (
                        <TooltipContent 
                          side="right" 
                          className="bg-surface-01 border-surface-stroke text-text-high z-50"
                          sideOffset={8}
                        >
                          {child.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen surface-00 flex">
      {/* Desktop Sidebar Rail */}
      <aside 
        ref={railRef}
        className={cn(
          "hidden lg:flex flex-col surface-01 border-r border-surface-stroke relative z-40 motion-curve",
          "fixed top-0 left-0 h-screen",
          isRailExpanded ? "w-60" : "w-14"
        )}
        onMouseEnter={handleRailMouseEnter}
        onMouseLeave={handleRailMouseLeave}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="overflow-hidden h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-64 h-full surface-01 border-r border-surface-stroke" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-surface-stroke">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-brand-accent to-purple-600 p-0.5">
                  <img 
                    src="/mio-ai-mascot.svg" 
                    alt="Mio AI" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-lg font-headline font-bold text-high">Mio AI</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-med hover:text-high"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SidebarContent isMobile />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 motion-curve",
          "lg:ml-14" // Always account for collapsed rail width
        )}
      >
        {/* Top Bar */}
        <header className="surface-01 border-b border-surface-stroke px-6 py-4 relative z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-med hover:text-high"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/app/home" className="text-med hover:text-high">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {currentPath !== '/app/home' && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-high font-medium">
                          {getBreadcrumb()}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-med hover:text-high">
                <Bell className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="User" />
                      <AvatarFallback className="bg-brand-accent text-white">A</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 surface-01 border-surface-stroke z-50" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-high">Alex Johnson</p>
                      <p className="text-xs text-med">alex@company.com</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-surface-stroke" />
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-surface-stroke" />
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}