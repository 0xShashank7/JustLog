// /components/user-profile.tsx
"use client" // This makes it a Client Component

import { authClient } from "@/lib/auth-client" // Adjust the path to your client instance

export function UserProfile() {
    // Use the reactive hook to get and track the session state
    const { data: session, isPending, error } = authClient.useSession()

    if (isPending) {
        return <div>Loading profile...</div>
    }

    if (error || !session) {
        return <div><p>Not logged in.</p></div>
    }

    // Access user details
    const user = session.user

    return (
        <div className="flex items-center space-x-4">
            <img src={user.image ? user.image : ''} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button onClick={() => authClient.signOut()}>Sign Out</button>
        </div>
    )
}