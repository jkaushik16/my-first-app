# My First App

Static landing page for <https://ai.jatinkaushik.com/first>, built via OpenClaw.

## Deploy steps

1. Copy static files from this repo into `/var/www/first`.
2. Ensure nginx is configured with a `location /first` block pointing at that folder.
3. Reload nginx and verify the domain serves the content.

## Todo app

- `todo/` holds a tiny SPA that stores tasks in `localStorage` (nothing is sent outside the browser).
- Deploy it by copying the folder to `/var/www/todo` and wiring nginx to serve `/todo`.
- Extend the deploy tooling or run a quick `sudo rsync` + `systemctl reload nginx` whenever you update it.
