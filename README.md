BookFlow

BookFlow is a modern online booking platform for small businesses and service providers.

✨ Features

- 📅 Online appointment booking
- 🕐 Availability & working-hours management
- 📋 Services and pricing management
- 📊 Business owner dashboard
- 🔎 Booking management
- 💬 WhatsApp integration
- 🚫 Anti-double-booking protection
- 📱 Mobile-friendly responsive design
- 🌍 Local & international currency support

🎯 Use Cases

Perfect for fitness trainers, gyms, salons, barbers, tutors, consultants, healthcare services, and other appointment-based businesses.

🛠️ Tech Stack

- TypeScript
- React
- Vite
- Supabase (PostgreSQL, Row Level Security, Auth)
- Tailwind CSS

📦 Supabase Database Setup

1. Create a project on [supabase.com](https://supabase.com).
2. In the Supabase dashboard, navigate to **SQL Editor**.
3. Copy and run the SQL script located in `supabase/schema.sql`.
4. (Optional) Run `supabase/seed.sql` to populate sample benchmark businesses.
5. In **Project Settings -> API**, copy your **Project URL** and **anon public key**.
6. Add them to your environment variables (`.env` locally, or in Vercel project settings):
   - `VITE_SUPABASE_URL=https://<your-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=<your-anon-key>`

🚀 Status

BookFlow supports full cloud-backed multi-tenant booking with Supabase, atomic anti-double booking, business hours & blocked time management, and WhatsApp booking confirmations.

🔮 Planned

CSV export, printable invoices, multi-business accounts, authentication, notifications, and payment integrations.

Built as an independent MVP project.
