"""
SSH helper — runs commands on remote hosts via paramiko.
"""

import os
import paramiko


def ssh_run(host, command, ssh_cfg=None):
    """
    Execute a command on a remote host via SSH.
    Returns stdout as a string, or None on failure.
    """
    ssh_cfg = ssh_cfg or {}
    user = ssh_cfg.get("user", "root")
    key_path = os.path.expanduser(ssh_cfg.get("key_path", "~/.ssh/id_rsa"))
    timeout = ssh_cfg.get("timeout", 10)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(
            hostname=host,
            username=user,
            key_filename=key_path,
            timeout=timeout,
            look_for_keys=False,
            allow_agent=False,
        )
        stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
        output = stdout.read().decode("utf-8", errors="ignore").strip()
        return output
    except Exception as e:
        print(f"[SSH] Failed {user}@{host}: {e}")
        return None
    finally:
        client.close()
