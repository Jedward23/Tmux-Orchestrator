import { JSX } from "preact";
import { Button } from "./Button.tsx";

interface CRMLayoutProps {
  children: JSX.Element;
  title?: string;
  currentPath?: string;
  userRole?: "admin" | "sales-manager" | "sales-rep";
  userName?: string;
}

export function CRMLayout({ 
  children, 
  title = "CRM Dashboard", 
  currentPath,
  userRole = "admin",
  userName = "User"
}: CRMLayoutProps) {
  const navigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "sales-manager", "sales-rep"] },
    { href: "/admin/customers", label: "Customers", icon: "👥", roles: ["admin", "sales-manager", "sales-rep"] },
    { href: "/admin/leads", label: "Leads", icon: "🎯", roles: ["admin", "sales-manager", "sales-rep"] },
    { href: "/admin/opportunities", label: "Pipeline", icon: "💰", roles: ["admin", "sales-manager", "sales-rep"] },
    { href: "/admin/activities", label: "Activities", icon: "📅", roles: ["admin", "sales-manager", "sales-rep"] },
    { href: "/admin/reports", label: "Reports", icon: "📈", roles: ["admin", "sales-manager"] },
    { href: "/admin/products", label: "Products", icon: "📦", roles: ["admin", "sales-manager"] },
    { href: "/admin/settings", label: "Settings", icon: "⚙️", roles: ["admin"] }
  ];

  const visibleItems = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <div class="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav class="navbar bg-white shadow-sm border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <a href="/admin/dashboard" class="navbar-brand flex items-center space-x-2">
                <div class="text-2xl">🏢</div>
                <div>
                  <div class="text-lg font-bold text-antko-blue-600">ANTKO</div>
                  <div class="text-xs text-slate-500">CRM System</div>
                </div>
              </a>
            </div>
            
            {/* User Info & Actions */}
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-antko-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div class="text-sm">
                  <div class="font-medium text-slate-900">{userName}</div>
                  <div class="text-slate-500 capitalize">{userRole.replace("-", " ")}</div>
                </div>
              </div>
              <Button variant="danger" size="sm" href="/admin/logout">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8 py-4">
            {visibleItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === item.href
                    ? "bg-antko-blue-100 text-antko-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span class="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div class="bg-gradient-to-r from-antko-blue-600 to-antko-blue-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center space-x-6">
              <div class="text-sm">
                <span class="font-medium">Quick Actions:</span>
              </div>
              <div class="flex space-x-4">
                <a href="/admin/leads/new" class="text-xs hover:text-blue-200 transition-colors">
                  + Add Lead
                </a>
                <a href="/admin/customers/new" class="text-xs hover:text-blue-200 transition-colors">
                  + Add Customer
                </a>
                <a href="/admin/opportunities/new" class="text-xs hover:text-blue-200 transition-colors">
                  + Add Opportunity
                </a>
              </div>
            </div>
            <div class="flex items-center space-x-4 text-sm">
              <div class="flex items-center space-x-2">
                <span class="text-blue-200">🎯</span>
                <span class="text-xs">Today's Tasks: 5</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-blue-200">📞</span>
                <span class="text-xs">Follow-ups: 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main class="animate-in py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-white border-t border-slate-200 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600">
              © 2024 ANTKO Corporate CRM. All rights reserved.
            </div>
            <div class="flex space-x-6 text-sm text-slate-600">
              <a href="/support" class="hover:text-antko-blue-600">Support</a>
              <a href="/docs" class="hover:text-antko-blue-600">Documentation</a>
              <a href="/privacy" class="hover:text-antko-blue-600">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}