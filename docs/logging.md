## Runtime Logging Playbook

- Viewing logs on the VPS:
  ```
  tail -f /var/log/returnshield/stack.log
  ```
- Log collector command (already running via `nohup`):
  ```
  cd /opt/ReturnShield && docker compose logs -f backend frontend dashboard posthog-proxy \
    > /var/log/returnshield/stack.log 2>&1
  ```
- Logs roll until manual restart. To stop: `pkill -f "docker compose logs"`.

