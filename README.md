# My First App

Static landing page for <https://ai.jatinkaushik.com/first>, built via OpenClaw.

## Deploy steps

1. Copy static files from this repo into `/var/www/first`.
2. Ensure nginx is configured with a `location /first` block pointing at that folder.
3. Reload nginx and verify the domain serves the content.

## Todo app

- `todo/` now contains a React-based single-page todo app that keeps everything in `localStorage`.
- Run the normal deploy steps for `/todo` by copying that folder into `/var/www/todo` (or extend the deploy script) and uptime-check the path.
- HTTPS is already handled via nginx + Let’s Encrypt so `https://ai.jatinkaushik.com/todo/` renders the new UI.
