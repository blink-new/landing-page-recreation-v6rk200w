import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Mail,
  Calendar,
  Shield,
  Users,
  Settings,
  Bot,
  BarChart3,
  HeadphonesIcon,
  Crown,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  createdAt: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: {
    aiAgent: boolean
    analytics: boolean
    settings: boolean
    support: boolean
  }
  userCount: number
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T14:30:00Z',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-15T12:15:00Z',
    createdAt: '2024-01-05T09:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: '2024-01-10T16:45:00Z',
    createdAt: '2024-01-08T14:20:00Z'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    role: 'Editor',
    status: 'pending',
    lastLogin: 'Never',
    createdAt: '2024-01-14T11:00:00Z'
  }
]

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full access to all features and settings',
    permissions: {
      aiAgent: true,
      analytics: true,
      settings: true,
      support: true
    },
    userCount: 1,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Can manage AI agents and view analytics',
    permissions: {
      aiAgent: true,
      analytics: true,
      settings: false,
      support: true
    },
    userCount: 2,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'Read-only access to analytics and conversations',
    permissions: {
      aiAgent: false,
      analytics: true,
      settings: false,
      support: false
    },
    userCount: 1,
    createdAt: '2024-01-01T10:00:00Z'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(mockUsers)
  const [roles, setRoles] = useState(mockRoles)
  const [searchQuery, setSearchQuery] = useState('')
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type?: 'user' | 'role'; item?: any }>({ open: false })
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: ''
  })
  
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {
      aiAgent: false,
      analytics: false,
      settings: false,
      support: false
    }
  })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-white'
      case 'inactive':
        return 'bg-surface-stroke text-med'
      case 'pending':
        return 'bg-warning text-white'
      default:
        return 'bg-surface-stroke text-med'
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-400" />
      case 'viewer':
        return <User className="w-4 h-4 text-green-400" />
      default:
        return <User className="w-4 h-4 text-med" />
    }
  }

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'aiAgent':
        return <Bot className="w-4 h-4" />
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />
      case 'settings':
        return <Settings className="w-4 h-4" />
      case 'support':
        return <HeadphonesIcon className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Please fill in all required fields.')
      return
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'pending',
      lastLogin: 'Never',
      createdAt: new Date().toISOString()
    }

    setUsers(prev => [user, ...prev])
    setCreateUserOpen(false)
    setNewUser({ name: '', email: '', role: '' })
    toast.success('User created successfully! Invitation email sent.')
  }

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      toast.error('Please fill in all required fields.')
      return
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      createdAt: new Date().toISOString()
    }

    setRoles(prev => [role, ...prev])
    setCreateRoleOpen(false)
    setNewRole({
      name: '',
      description: '',
      permissions: {
        aiAgent: false,
        analytics: false,
        settings: false,
        support: false
      }
    })
    toast.success('Role created successfully!')
  }

  const handleDelete = () => {
    if (!deleteDialog.item) return

    if (deleteDialog.type === 'user') {
      setUsers(prev => prev.filter(user => user.id !== deleteDialog.item.id))
      toast.success('User deleted successfully!')
    } else if (deleteDialog.type === 'role') {
      setRoles(prev => prev.filter(role => role.id !== deleteDialog.item.id))
      toast.success('Role deleted successfully!')
    }

    setDeleteDialog({ open: false })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Settings
        </h1>
        <p className="text-med">
          Manage users, roles, and permissions for your organization.
        </p>
      </div>

      {/* Main Content */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <CardTitle className="text-high">Users & Roles Management</CardTitle>
          <p className="text-med">
            Control access and permissions for team members in your organization.
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
                <Badge variant="secondary" className="ml-2">
                  {users.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Roles</span>
                <Badge variant="secondary" className="ml-2">
                  {roles.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-med" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 surface-01 border-surface-stroke text-high"
                    placeholder="Search users..."
                  />
                </div>
                
                <Sheet open={createUserOpen} onOpenChange={setCreateUserOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="surface-01 border-surface-stroke">
                    <SheetHeader>
                      <SheetTitle className="text-high">Create New User</SheetTitle>
                      <SheetDescription className="text-med">
                        Add a new team member to your organization.
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="user-name" className="text-high font-medium">Full Name</Label>
                        <Input
                          id="user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user-email" className="text-high font-medium">Email Address</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="john.doe@company.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-high font-medium">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className="surface-01 border-surface-stroke text-high">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent className="surface-01 border-surface-stroke">
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                <div className="flex items-center space-x-2">
                                  {getRoleIcon(role.name)}
                                  <span>{role.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCreateUserOpen(false)}
                          className="border-surface-stroke text-med hover:text-high"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateUser}
                          className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                        >
                          Create User
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Users Table */}
              <div className="border border-surface-stroke rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-surface-stroke hover:bg-surface-stroke/20">
                      <TableHead className="text-med">User</TableHead>
                      <TableHead className="text-med">Role</TableHead>
                      <TableHead className="text-med">Status</TableHead>
                      <TableHead className="text-med">Last Login</TableHead>
                      <TableHead className="text-med">Created</TableHead>
                      <TableHead className="text-med w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.id} 
                        className={`border-surface-stroke hover:bg-surface-stroke/10 ${
                          index % 2 === 1 ? 'bg-surface-stroke/5' : ''
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent/30 to-purple-600/30 flex items-center justify-center">
                              <User className="w-4 h-4 text-brand-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-high">{user.name}</p>
                              <p className="text-sm text-med">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <span className="text-high">{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-high">{formatDate(user.lastLogin)}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-high">{formatDate(user.createdAt)}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="surface-01 border-surface-stroke">
                              <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-error hover:bg-error/10 cursor-pointer"
                                onClick={() => setDeleteDialog({ open: true, type: 'user', item: user })}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="space-y-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-med" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 surface-01 border-surface-stroke text-high"
                    placeholder="Search roles..."
                  />
                </div>
                
                <Sheet open={createRoleOpen} onOpenChange={setCreateRoleOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Role
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="surface-01 border-surface-stroke">
                    <SheetHeader>
                      <SheetTitle className="text-high">Create New Role</SheetTitle>
                      <SheetDescription className="text-med">
                        Define a new role with specific permissions.
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="role-name" className="text-high font-medium">Role Name</Label>
                        <Input
                          id="role-name"
                          value={newRole.name}
                          onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="Manager"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role-description" className="text-high font-medium">Description</Label>
                        <Input
                          id="role-description"
                          value={newRole.description}
                          onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="Can manage team and view reports"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-high font-medium">Permissions</Label>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-surface-stroke rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Bot className="w-5 h-5 text-brand-accent" />
                              <div>
                                <p className="font-medium text-high">AI Agent</p>
                                <p className="text-sm text-med">Create and manage AI agents</p>
                              </div>
                            </div>
                            <Switch
                              checked={newRole.permissions.aiAgent}
                              onCheckedChange={(checked) => 
                                setNewRole(prev => ({
                                  ...prev,
                                  permissions: { ...prev.permissions, aiAgent: checked }
                                }))
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-surface-stroke rounded-lg">
                            <div className="flex items-center space-x-3">
                              <BarChart3 className="w-5 h-5 text-blue-400" />
                              <div>
                                <p className="font-medium text-high">Analytics</p>
                                <p className="text-sm text-med">View reports and analytics</p>
                              </div>
                            </div>
                            <Switch
                              checked={newRole.permissions.analytics}
                              onCheckedChange={(checked) => 
                                setNewRole(prev => ({
                                  ...prev,
                                  permissions: { ...prev.permissions, analytics: checked }
                                }))
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-surface-stroke rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Settings className="w-5 h-5 text-purple-400" />
                              <div>
                                <p className="font-medium text-high">Settings</p>
                                <p className="text-sm text-med">Manage organization settings</p>
                              </div>
                            </div>
                            <Switch
                              checked={newRole.permissions.settings}
                              onCheckedChange={(checked) => 
                                setNewRole(prev => ({
                                  ...prev,
                                  permissions: { ...prev.permissions, settings: checked }
                                }))
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border border-surface-stroke rounded-lg">
                            <div className="flex items-center space-x-3">
                              <HeadphonesIcon className="w-5 h-5 text-green-400" />
                              <div>
                                <p className="font-medium text-high">Support</p>
                                <p className="text-sm text-med">Access support features</p>
                              </div>
                            </div>
                            <Switch
                              checked={newRole.permissions.support}
                              onCheckedChange={(checked) => 
                                setNewRole(prev => ({
                                  ...prev,
                                  permissions: { ...prev.permissions, support: checked }
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setCreateRoleOpen(false)}
                          className="border-surface-stroke text-med hover:text-high"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateRole}
                          className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                        >
                          Create Role
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Roles Table */}
              <div className="border border-surface-stroke rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-surface-stroke hover:bg-surface-stroke/20">
                      <TableHead className="text-med">Role</TableHead>
                      <TableHead className="text-med">Permissions</TableHead>
                      <TableHead className="text-med">Users</TableHead>
                      <TableHead className="text-med">Created</TableHead>
                      <TableHead className="text-med w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role, index) => (
                      <TableRow 
                        key={role.id} 
                        className={`border-surface-stroke hover:bg-surface-stroke/10 ${
                          index % 2 === 1 ? 'bg-surface-stroke/5' : ''
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(role.name)}
                            <div>
                              <p className="font-medium text-high">{role.name}</p>
                              <p className="text-sm text-med">{role.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(role.permissions).map(([key, value]) => (
                              value && (
                                <Badge 
                                  key={key} 
                                  variant="outline" 
                                  className="border-brand-accent/30 text-brand-accent text-xs"
                                >
                                  <div className="flex items-center space-x-1">
                                    {getPermissionIcon(key)}
                                    <span className="capitalize">
                                      {key === 'aiAgent' ? 'AI Agent' : key}
                                    </span>
                                  </div>
                                </Badge>
                              )
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {role.userCount} users
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-high">{formatDate(role.createdAt)}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="surface-01 border-surface-stroke">
                              <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-error hover:bg-error/10 cursor-pointer"
                                onClick={() => setDeleteDialog({ open: true, type: 'role', item: role })}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent className="surface-01 border-surface-stroke">
          <DialogHeader>
            <DialogTitle className="text-high flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-error" />
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-med">
              Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
              {deleteDialog.type === 'role' && deleteDialog.item?.userCount > 0 && (
                <span className="block mt-2 text-warning">
                  Warning: This role is assigned to {deleteDialog.item.userCount} user(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false })}
              className="border-surface-stroke text-med hover:text-high"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              className="bg-error hover:bg-error/90 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}