export default function handler(req, res) {
  // Expose only public values (publishable) — never expose service_role here
  const config = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(config);
}
