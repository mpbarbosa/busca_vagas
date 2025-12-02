# Configuration Files

This directory contains configuration files for deploying and managing the Busca Vagas API.

## Files

### busca_vagas_node_app.service

Systemd service configuration file for running the API as a system service on Linux.

**Usage:**
```bash
sudo cp busca_vagas_node_app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable busca_vagas_node_app.service
sudo systemctl start busca_vagas_node_app.service
```

**Documentation:** See [docs/SYSTEMD_SERVICE.md](../docs/SYSTEMD_SERVICE.md) for complete setup and troubleshooting guide.

## Important Notes

⚠️ **Before installing**: Update the following in `busca_vagas_node_app.service`:
- `User=ubuntu` - Change to your system user
- `WorkingDirectory=/home/ubuntu/Documents/GitHub/busca_vagas` - Update to your installation path
- `ExecStart=/usr/bin/node /home/ubuntu/Documents/GitHub/busca_vagas/src/server.js` - Update path if needed

## See Also

- [Systemd Service Documentation](../docs/SYSTEMD_SERVICE.md)
- [Main README](../README.md)
