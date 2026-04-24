#!/bin/bash
# Infr-Orchestrator Collector Setup
# Run this on the collector LXC/VM to install dependencies.

set -euo pipefail

echo "=== Infr-Orchestrator Collector Setup ==="

# Install system packages
echo "[1/4] Installing system packages..."
apt-get update -qq
apt-get install -y -qq python3 python3-pip python3-venv fping sysstat curl openssh-client

# Create venv
echo "[2/4] Creating Python virtual environment..."
python3 -m venv /opt/infr-collector/venv
source /opt/infr-collector/venv/bin/activate

# Install Python packages
echo "[3/4] Installing Python dependencies..."
pip install --quiet -r requirements.txt

# Generate SSH key if not exists
echo "[4/4] Checking SSH key..."
if [ ! -f ~/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -q
    echo "  SSH key generated at ~/.ssh/id_rsa"
    echo ""
    echo "  Copy this public key to each Proxmox node:"
    echo ""
    cat ~/.ssh/id_rsa.pub
    echo ""
    echo "  On each node, run:"
    echo "    mkdir -p ~/.ssh && echo '<public_key>' >> ~/.ssh/authorized_keys"
else
    echo "  SSH key already exists"
fi

# Copy example config if needed
if [ ! -f config.yaml ]; then
    cp config.yaml.example config.yaml
    echo ""
    echo "  Created config.yaml from example — edit it with your node details."
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit config.yaml with your Proxmox node IPs"
echo "  2. Copy your SSH public key to each node"
echo "  3. Start the collector:"
echo "     source /opt/infr-collector/venv/bin/activate"
echo "     python app.py"
echo ""
echo "  Dashboard will be available at http://<collector-ip>:8081"
