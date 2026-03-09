"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getUserAvatar } from "@/utils/avatars";
import * as Types from "@/types/action.interfaces";

interface DashboardHeaderProps {
  initialUser?: Types.User | null;
  breadcrumbs: Array<{ href: string; label: string; isLast: boolean }>;
  userNavigation: Array<{ name: string; href: string }>;
}

export function DashboardHeader({
  initialUser,
  breadcrumbs,
  userNavigation,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-16">
      <div className="h-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          {/* Left side - Breadcrumbs */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button will be handled by parent */}
            <nav className="flex items-center space-x-1">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-muted-foreground">/</span>
                  )}
                  <span
                    className={`text-sm ${
                      breadcrumb.isLast
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {breadcrumb.label}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Right side - Profile and Notifications */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            {/* User profile section */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">
                  {initialUser?.full_name ||
                    initialUser?.name ||
                    initialUser?.email ||
                    "Guest User"}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {initialUser?.role
                    ? initialUser.role.charAt(0).toUpperCase() +
                      initialUser.role.slice(1)
                    : "User"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getUserAvatar(
                          initialUser?.full_name || initialUser?.name,
                          initialUser?.email,
                          "adventurer",
                          40,
                        )}
                        alt="User avatar"
                      />
                      <AvatarFallback className="text-sm">
                        {(
                          initialUser?.full_name ||
                          initialUser?.name ||
                          initialUser?.email ||
                          "U"
                        )
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getUserAvatar(
                          initialUser?.full_name || initialUser?.name,
                          initialUser?.email,
                          "adventurer",
                          40,
                        )}
                        alt="User avatar"
                      />
                      <AvatarFallback className="text-sm">
                        {(
                          initialUser?.full_name ||
                          initialUser?.name ||
                          initialUser?.email ||
                          "U"
                        )
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">
                        {initialUser?.full_name ||
                          initialUser?.name ||
                          initialUser?.email ||
                          "Guest User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {initialUser?.email || "guest@polifin.com"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {initialUser?.role
                          ? initialUser.role.charAt(0).toUpperCase() +
                            initialUser.role.slice(1)
                          : "User"}{" "}
                        •{" "}
                        {initialUser?.permissions?.join(", ") ||
                          "Standard access"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <a href={item.href} className="cursor-pointer">
                        {item.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/auth/logout" className="cursor-pointer">
                      Log out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
