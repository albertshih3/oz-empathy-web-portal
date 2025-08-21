"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavBarProps {
    isAuthenticated?: boolean;
}

export function NavBar({ isAuthenticated = false }: NavBarProps) {
    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Main Menu</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href={isAuthenticated ? "/home" : "/"}
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Main Menu
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                {isAuthenticated 
                                                    ? "Manage and edit animals in the database." 
                                                    : "Go back to the home page to view all animals in the database."
                                                }
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                {isAuthenticated ? (
                                    <ListItem href="/home" title="Manage Animals">
                                        Edit, add, and manage animals in the database.
                                    </ListItem>
                                ) : (
                                    <ListItem href="/" title="Login to Manage Animals">
                                        Sign in to edit, add, and manage animals in the database.
                                    </ListItem>
                                )}
                                <ListItem href="/download" title="Download the app">
                                    View the external app download page to download the app.
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/download" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Download The App
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
