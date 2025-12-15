
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { stackServerApp } from '@/stack/server'
import { LogIn } from 'lucide-react'

export default async function SignIn() {

    const user = await stackServerApp.getUser();
    const app = stackServerApp.urls;

    return (
        <Button
            variant="ghost"
            className="flex items-center gap-2"
            asChild
        >
            <Link href={app.signIn}>
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
            </Link>
        </Button>
    )
}