# Supabase Integration

This project now includes Supabase integration for backend services, authentication, and database operations.

## 🚀 Quick Start

### 1. Set up your Supabase project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be fully initialized

### 2. Configure Environment Variables

1. Copy your project credentials from the Supabase dashboard:
   - Go to **Settings > API**
   - Copy the **Project URL** and **anon key**

2. Update the `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Restart Development Server

```bash
pnpm run dev
```

## 📁 Files Created

- **`lib/supabase.ts`** - Main Supabase client for client-side operations
- **`lib/supabase-server.ts`** - Server-side client for API routes and admin operations
- **`hooks/use-supabase.ts`** - React hooks for easy Supabase integration
- **`types/supabase.ts`** - TypeScript types for your database schema
- **`components/supabase-test.tsx`** - Test component to verify connection
- **`.env.local`** - Environment variables (add your credentials here)
- **`.env.example`** - Example environment file

## 🧪 Testing the Connection

Add the test component to any page to verify your connection:

```tsx
import SupabaseTest from '@/components/supabase-test'

export default function Page() {
  return (
    <div>
      <SupabaseTest />
    </div>
  )
}
```

## 🔧 Usage Examples

### Basic Query
```tsx
import { supabase } from '@/lib/supabase'

// Get data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ column: 'value' })
```

### Authentication Hook
```tsx
import { useAuth } from '@/hooks/use-supabase'

export default function Component() {
  const { user, session, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## 🔒 Security Notes

- Never commit your actual environment variables to version control
- The anon key is safe to use in client-side code
- Keep your service role key secret and only use it server-side
- Use Row Level Security (RLS) in Supabase for data protection

## 📚 Next Steps

1. Create tables in your Supabase database
2. Set up Row Level Security policies
3. Generate TypeScript types: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts`
4. Build your authentication flows
5. Create your data models and queries

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)