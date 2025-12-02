# Deployment Quick Start Guide

## 🚀 Deploy in 5 Commands

```bash
# 1. Validate your environment
./shell_scripts/deploy.sh validate

# 2. Install the systemd service
./shell_scripts/deploy.sh install

# 3. Start the service
./shell_scripts/deploy.sh start

# 4. Check it's running
./shell_scripts/deploy.sh status

# 5. Enable auto-start on boot
./shell_scripts/deploy.sh enable
```

## ✅ That's it! Your API is now running as a service.

## 📖 Common Operations

```bash
# View logs (last 50 lines)
./shell_scripts/deploy.sh logs

# Follow logs in real-time
./shell_scripts/deploy.sh logs -f

# Restart the service
./shell_scripts/deploy.sh restart

# Stop the service
./shell_scripts/deploy.sh stop
```

## 🔧 Update and Redeploy

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Reload daemon and restart with new code
./shell_scripts/deploy.sh reload

# Verify it's running
./shell_scripts/deploy.sh status

# Check logs for any errors
./shell_scripts/deploy.sh logs -n 50
```

**Note**: Use `reload` instead of `restart` when deploying new code. It performs `daemon-reload` before restarting the service.

## 📚 Full Documentation

- **Deployment Script**: [docs/DEPLOYMENT_SCRIPT.md](docs/DEPLOYMENT_SCRIPT.md)
- **Systemd Service**: [docs/SYSTEMD_SERVICE.md](docs/SYSTEMD_SERVICE.md)
- **Service Configuration**: [config/README.md](config/README.md)

## ⚠️ Before First Deployment

Update these settings in `config/busca_vagas_node_app.service`:

```ini
User=your_username              # Change from 'ubuntu'
WorkingDirectory=/your/path     # Change to your installation path
ExecStart=/usr/bin/node /your/path/src/server.js
```

Then run the deployment commands above.

## 🆘 Troubleshooting

**Problem**: Service won't start
```bash
# Check detailed logs
./shell_scripts/deploy.sh logs -n 100
```

**Problem**: Validation fails
```bash
# See what's wrong
./shell_scripts/deploy.sh validate
```

**Problem**: Port already in use
```bash
# Edit config/busca_vagas_node_app.service
# Change: Environment=PORT=3005
# To:     Environment=PORT=8080 (or any available port)
# Then:
./shell_scripts/deploy.sh install
./shell_scripts/deploy.sh restart
```

## 💡 Quick Tips

- Always run `validate` before deploying
- Use `test` to try the app without systemd
- Enable the service for production servers
- Check `status` after every operation
- Use `logs -f` to debug issues in real-time

---
**Need help?** See [docs/DEPLOYMENT_SCRIPT.md](docs/DEPLOYMENT_SCRIPT.md) for complete reference.
