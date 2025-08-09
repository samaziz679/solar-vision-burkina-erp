import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default async function Dashboard() {
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    },
  })

  // Fetch data from Supabase
  const { data, error } = await supabase.from("your_table").select("*")

  if (error) {
    console.error("Error fetching data:", error)
    return <div>Error loading data</div>
  }

  return (
    <div>
      {/* Render your dashboard here */}
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
