```
 ███╗   ██╗███╗   ███╗ █████╗ ██████╗ ██████╗ ██████╗ ██╗    ██╗███╗   ██╗
 ████╗  ██║████╗ ████║██╔══██╗██╔══██╗╚════██╗██╔══██╗██║    ██║████╗  ██║
 ██╔██╗ ██║██╔████╔██║███████║██████╔╝ █████╔╝██████╔╝██║ █╗ ██║██╔██╗ ██║
 ██║╚██╗██║██║╚██╔╝██║██╔══██║██╔═══╝ ██╔═══╝ ██╔═══╝ ██║███╗██║██║╚██╗██║
 ██║ ╚████║██║ ╚═╝ ██║██║  ██║██║     ███████╗██║     ╚███╔███╔╝██║ ╚████║
 ╚═╝  ╚═══╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝      ╚══╝╚══╝ ╚═╝  ╚═══╝
                    Paste. Parse. Pwn.
```

<p align="center">
  <strong>The pentester's command generator. Paste Nmap output, get ready-to-run attack commands.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Commands-407+-blueviolet?style=flat-square" alt="Commands" />
</p>

---

## What is Nmap2Pwn?

Nmap2Pwn is a **zero-database, offline-ready** web application that transforms raw Nmap scan output into **copy-pasteable pentesting commands** — with your target IP, credentials, and hashes already embedded. Think of it as GTFOBins meets HackTricks, purpose-built for Active Directory and CTF environments.

Paste your scan. Fill in your creds. Copy the command. Pwn the box.

---

## Key Features

- **Nmap Parser Mode** — Paste raw Nmap output and instantly get commands tailored to every detected open port
- **Manual Browse Mode** — Explore all 14 supported ports and 65+ tools without running a scan first
- **Real-Time Global Variables** — Set `IP`, `USERNAME`, `PASSWORD`, `DOMAIN`, `HASH`, and `WORDLIST` once in the top panel; every command updates live across the entire UI
- **407+ Ready-to-Run Commands** — Exhaustive coverage of Impacket, NetExec, evil-winrm, BloodHound, Kerbrute, gobuster, and dozens more
- **One-Click Copy** — Every command has a copy button with instant visual feedback
- **Expandable Descriptions** — Click any command to learn *why* you'd run it
- **Zero Database** — All command data lives in modular JSON files; no setup, no migrations
- **Extensible** — Add new ports or tools by dropping a JSON file into a folder

---

## Supported Ports & Tools

| Port | Service | Key Tools |
|---|---|---|
| 21 | FTP | ftp, wget, curl, hydra |
| 22 | SSH | ssh, sshpass, ssh2john, hydra, chisel |
| 80 | HTTP | gobuster, feroxbuster, nikto, whatweb, wpscan, curl |
| 88 | Kerberos | GetNPUsers.py, GetUserSPNs.py, kerbrute, Rubeus |
| 135 | MSRPC | rpcclient, rpcdump.py, wmiexec.py, dcomexec.py, atexec.py |
| 139 | NetBIOS | enum4linux-ng, smbclient, nxc |
| 389 | LDAP | nxc ldap, ldapsearch, bloodhound-python, windapsearch |
| 443 | HTTPS | gobuster, feroxbuster, nikto, sslscan, testssl.sh |
| 445 | SMB | nxc smb, psexec.py, smbexec.py, secretsdump.py, ntlmrelayx.py, ticketer.py |
| 1433 | MSSQL | mssqlclient.py, nxc mssql, sqsh |
| 3268 | Global Catalog | ldapsearch (forest-wide), nxc ldap |
| 3389 | RDP | xfreerdp, rdesktop, crowbar, hydra |
| 5985 | WinRM | evil-winrm, nxc winrm |
| 5986 | WinRM (HTTPS) | evil-winrm (SSL), nxc winrm |

---

## Screenshots

> Screenshots coming soon. The UI is a dark, monospace, GTFOBins-style interface.

![Nmap2Pwn — Parse Mode](screenshots/parse-mode.png)
![Nmap2Pwn — Browse Mode](screenshots/browse-mode.png)
![Nmap2Pwn — Global Variables](screenshots/global-vars.png)

---

## Installation

### Prerequisites

- [Go](https://go.dev/dl/) 1.22+
- [Node.js](https://nodejs.org/) 18+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nmap2pwn.git
cd nmap2pwn
```

### 2. Start the backend

```bash
cd backend
go mod tidy
go run ./cmd/server/
```

The API server starts on `http://localhost:8080`. To use a different port:

```bash
NMAP2PWN_ADDR=":3333" go run ./cmd/server/
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The UI opens at `http://localhost:5173` with API requests proxied to the backend.

> **Note:** If your backend runs on a non-default port, update the proxy target in `frontend/vite.config.ts`.

---

## Adding Custom Commands

Nmap2Pwn's knowledge base is entirely file-driven. To add commands for a new port or tool:

**1.** Create a JSON file in `backend/data/ports/`:

```json
{
  "port": 8080,
  "protocol": "tcp",
  "service": "HTTP-Proxy",
  "description": "Your service description here.",
  "tools": [
    {
      "name": "Your Tool Name",
      "description": "What this tool does.",
      "commands": [
        {
          "title": "Command title",
          "command": "your-tool --target {{IP}} -u {{USERNAME}}",
          "description": "When and why to use this command."
        }
      ]
    }
  ]
}
```

**2.** Restart the backend. That's it. The new port and commands appear instantly in the UI.

### Placeholder Reference

| Placeholder | Description | Auto-filled? |
|---|---|---|
| `{{IP}}` | Target IP address | Yes (from Nmap parse) |
| `{{TARGET_IP}}` | Secondary target (relay, etc.) | No |
| `{{USERNAME}}` | Username | No |
| `{{PASSWORD}}` | Password | No |
| `{{DOMAIN}}` | Active Directory domain | No |
| `{{HASH}}` | NTLM hash | No |
| `{{WORDLIST}}` | Path to wordlist file | No |

All placeholders can be set globally via the Variables panel in the UI.

---

## Project Structure

```
nmap2pwn/
├── backend/
│   ├── cmd/server/main.go        # Entry point
│   ├── internal/
│   │   ├── parser/nmap.go        # Nmap output parser (regex)
│   │   ├── handler/              # HTTP handlers (parse, ports, health)
│   │   ├── store/loader.go       # JSON file loader + in-memory cache
│   │   ├── model/                # Data structs
│   │   └── router/router.go     # Gin routes + CORS
│   └── data/ports/               # 14 JSON command databases
│
├── frontend/
│   └── src/
│       ├── context/              # Global Variables (React Context)
│       ├── components/           # CommandCard, NmapInput, Layout, etc.
│       ├── pages/                # Home (Parse), BrowsePorts, PortDetail
│       ├── services/api.ts       # Backend API client
│       └── hooks/                # useClipboard
│
└── README.md
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Go + Gin | Fast, single-binary, zero external dependencies for core logic |
| Frontend | React 19 + Vite | Instant HMR, TypeScript, modern tooling |
| Styling | Tailwind CSS 4 | Utility-first, dark mode, no CSS files to maintain |
| Data | JSON files | No database setup, easy to contribute, git-friendly diffs |

---

## Contributing

Contributions are welcome! The easiest way to contribute is to add commands:

1. Fork the repository
2. Add or expand a JSON file in `backend/data/ports/`
3. Validate your JSON: `python3 -m json.tool your_file.json`
4. Submit a pull request

For code contributions, please open an issue first to discuss the change.

---

## Disclaimer

> **This tool is provided for educational purposes and authorized security testing only.**
>
> Nmap2Pwn is designed to assist cybersecurity professionals, penetration testers, and CTF players who have **explicit written authorization** to test the target systems. Unauthorized access to computer systems is illegal.
>
> The authors assume **no liability** and are **not responsible** for any misuse or damage caused by this tool. By using Nmap2Pwn, you agree that you are solely responsible for your actions and that you will comply with all applicable local, state, national, and international laws.
>
> **Always obtain proper authorization before testing any system you do not own.**

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <sub>Built for the offensive security community. Star the repo if it saves you time.</sub>
</p>
