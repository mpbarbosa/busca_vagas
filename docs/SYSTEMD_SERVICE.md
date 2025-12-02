# Systemd Service Configuration

## Overview

This document describes how to set up and manage the Busca Vagas API as a systemd service on Linux systems.

## Service File

The systemd service file is located at: `config/busca_vagas_node_app.service`

### Service Configuration

```ini
[Unit]
Description=Busca Vagas API
Documentation=https://github.com/mpbarbosa/busca_vagas
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/Documents/GitHub/busca_vagas
ExecStart=/usr/bin/node /home/ubuntu/Documents/GitHub/busca_vagas/src/server.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=busca_vagas_api

# Environment variables
Environment=NODE_ENV=production
Environment=PORT=3005

# Security settings
NoNewPrivileges=true
PrivateTmp=true

# Resource limits
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

## Installation

### 1. Copy Service File

```bash
sudo cp config/busca_vagas_node_app.service /etc/systemd/system/
```

### 2. Reload Systemd

```bash
sudo systemctl daemon-reload
```

### 3. Enable Service (Start on Boot)

```bash
sudo systemctl enable busca_vagas_node_app.service
```

### 4. Start Service

```bash
sudo systemctl start busca_vagas_node_app.service
```

## Service Management

### Check Status

```bash
sudo systemctl status busca_vagas_node_app.service
```

### Stop Service

```bash
sudo systemctl stop busca_vagas_node_app.service
```

### Restart Service

```bash
sudo systemctl restart busca_vagas_node_app.service
```

### Disable Service (Prevent Auto-start)

```bash
sudo systemctl disable busca_vagas_node_app.service
```

## Logs

### View Service Logs

```bash
sudo journalctl -u busca_vagas_node_app.service
```

### Follow Logs in Real-time

```bash
sudo journalctl -u busca_vagas_node_app.service -f
```

### View Last 100 Lines

```bash
sudo journalctl -u busca_vagas_node_app.service -n 100
```

### View Logs Since Today

```bash
sudo journalctl -u busca_vagas_node_app.service --since today
```

## Configuration Details

### User and Working Directory

- **User**: `ubuntu` - Change this to match your system user
- **WorkingDirectory**: `/home/ubuntu/Documents/GitHub/busca_vagas` - Update path as needed

### Environment Variables

The service sets:
- `NODE_ENV=production` - Enables production mode
- `PORT=3005` - API listens on port 3005

To add more environment variables, add additional `Environment=` lines in the `[Service]` section.

### Auto-Restart

- **Restart**: `on-failure` - Restarts if the process exits with an error
- **RestartSec**: `10` - Waits 10 seconds before restarting

### Security Features

- **NoNewPrivileges**: Prevents privilege escalation
- **PrivateTmp**: Provides isolated /tmp directory

### Resource Limits

- **LimitNOFILE**: `65536` - Maximum number of open file descriptors

## Troubleshooting

### Service Won't Start

1. Check the service status:
   ```bash
   sudo systemctl status busca_vagas_node_app.service
   ```

2. View detailed logs:
   ```bash
   sudo journalctl -u busca_vagas_node_app.service -n 50
   ```

3. Verify Node.js is installed:
   ```bash
   which node
   node --version
   ```

4. Check file paths in the service file are correct

5. Ensure the user has permissions to access the working directory

### Common Issues

#### Error: "code=exited, status=200/CHDIR"

This means the WorkingDirectory path is incorrect or inaccessible.

**Solution**: Update the WorkingDirectory path in the service file to match your installation location.

#### Error: "code=exited, status=2"

Node.js cannot find or execute the server file.

**Solution**: Verify the ExecStart path points to `src/server.js`, not `package.json`.

#### Port Already in Use

Another process is using port 3005.

**Solution**: 
- Change the PORT environment variable in the service file
- Or stop the conflicting service

### Testing Before Installing

Test the service configuration manually:

```bash
cd /home/ubuntu/Documents/GitHub/busca_vagas
NODE_ENV=production PORT=3005 node src/server.js
```

## Updating the Service

After modifying the service file:

```bash
sudo cp config/busca_vagas_node_app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl restart busca_vagas_node_app.service
```

## Uninstalling

To completely remove the service:

```bash
sudo systemctl stop busca_vagas_node_app.service
sudo systemctl disable busca_vagas_node_app.service
sudo rm /etc/systemd/system/busca_vagas_node_app.service
sudo systemctl daemon-reload
```

## Production Checklist

- [ ] Update `User` to match your system user
- [ ] Update `WorkingDirectory` to your installation path
- [ ] Update `ExecStart` path if necessary
- [ ] Configure environment variables (PORT, NODE_ENV, etc.)
- [ ] Test service starts correctly
- [ ] Enable service for auto-start on boot
- [ ] Configure firewall to allow port 3005 (if needed)
- [ ] Set up log rotation if needed
- [ ] Configure monitoring/alerting

## See Also

- [systemd.service documentation](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [systemd.exec documentation](https://www.freedesktop.org/software/systemd/man/systemd.exec.html)
- [Node.js production best practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
