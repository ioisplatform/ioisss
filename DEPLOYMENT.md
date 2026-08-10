# IOIS Complete Setup — Deployment Order

## 1) Supabase database
Open Supabase Dashboard → SQL Editor and run:
`supabase/schema.sql`

This creates the IOIS membership plans, profiles, members, payments, referrals, admin profile table, RLS policies and the new-user trigger.

## 2) Admin account
Create the admin account through Supabase Auth or the website. Copy that user's UUID and run:
`insert into public.admin_profiles(user_id,role) values('YOUR-AUTH-USER-UUID','admin');`

## 3) Telegram notification
Deploy:
`supabase/functions/iois-registration-notification/index.ts`

Set server-side secrets only:
- `TELEGRAM_BOT_TOKEN` = your current bot token
- `TELEGRAM_CHAT_ID` = `964524685`

The bot username is `@iois_admin_notification_bot`.
Never place the bot token in HTML, JS, GitHub, or this ZIP.

## 4) Frontend
Upload the contents of this folder to GitHub Pages, Vercel, Netlify, or another static host.

## 5) Important Auth setting
If Supabase email confirmation is enabled, users must verify their email before login. The database trigger creates the profile/member row at signup even when the browser session is not yet available.

## 6) Functional flow
Home → Membership/Register → Supabase Auth → profile/member creation → Login → Dashboard → Payment → Admin verification → membership status → ID Card/Certificate.

## 7) Home page theme
`index.html` is kept as the existing single-page premium dark/gold theme. The home registration/login forms now route to the real Supabase-backed pages instead of the old local demo session.
