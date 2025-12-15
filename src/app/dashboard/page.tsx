// /app/dashboard/page.tsx or a Server Component file
import { UserProfile } from "@/components/user-profile"
import { auth } from "@/lib/auth" // Adjust the path to your Better Auth server instance
import { headers } from "next/headers" // Important: Next.js headers function
import Workouts from "@/components/workouts"

export default async function DashboardPage() {
    // 1. Get the HTTP headers from the request
    const requestHeaders = headers()

    // 2. Pass the headers to getSession to allow Better Auth to validate the session cookie
    const session = await auth.api.getSession({
        headers: requestHeaders,
    })

    // 3. Check if the session exists (user is logged in)
    if (!session) {
        // You would typically redirect the user to a login page here
        return <div>Not Authenticated. Please log in.</div>
    }

    // 4. Access the Drizzle-backed user details from the session object
    const user = session.user

    return (
        <div>
            <h1>Welcome back, {user.name || "User"}!</h1>
            <p>Your Drizzle User ID: **{user.id}**</p>
            <p>Email: {user.email}</p>
            {/* The session object includes user data stored by the Drizzle adapter */}
            <pre>{JSON.stringify(user, null, 2)}</pre>

            <UserProfile />

            {
                user.id && (
                    <Workouts />
                )
            }

        </div>
    )
}