# IOIS Updated Package — Registration & Button Fixes

## Fixed
- Removed duplicate registration modal from `index.html`.
- Removed duplicate login modal from `index.html`.
- Home Login/Register/Join/plan buttons now use the single official pages.
- `register.html` now includes plan selection and service selection.
- Selected services are saved into Supabase `members.selected_services`.
- Added member/service details to dashboard.
- Added payment/member details and duplicate pending-payment protection.
- Removed unused legacy `` from this package.
- Centralized plan definitions in `config.js`.

## Supabase
Run `supabase/schema.sql` in Supabase SQL Editor. The schema adds `selected_services` to `public.members` and updates the auth trigger.

## Telegram
Telegram bot token is intentionally NOT included. Keep it as a server-side secret in the Supabase Edge Function. Chat ID: `964524685`; bot: `@iois_admin_notification_bot`.
