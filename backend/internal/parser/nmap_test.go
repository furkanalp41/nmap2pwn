package parser

import (
	"errors"
	"reflect"
	"testing"
)

func TestParse_StandardTCPScan(t *testing.T) {
	raw := `Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-15 10:00 UTC
Nmap scan report for 10.10.10.100
Host is up (0.045s latency).
Not shown: 65515 closed tcp ports (reset)
PORT      STATE SERVICE
21/tcp    open  ftp
22/tcp    open  ssh
80/tcp    open  http
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
1433/tcp  open  ms-sql-s
3268/tcp  open  globalcatLDAP
3389/tcp  open  ms-wbt-server
5985/tcp  open  wsman
9389/tcp  open  adws

Nmap done: 1 IP address (1 host up) scanned in 42.35 seconds`

	result, err := Parse(raw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.IP != "10.10.10.100" {
		t.Errorf("IP = %q, want %q", result.IP, "10.10.10.100")
	}

	expected := []int{21, 22, 80, 88, 135, 139, 389, 445, 464, 593, 636, 1433, 3268, 3389, 5985, 9389}
	if !reflect.DeepEqual(result.Ports, expected) {
		t.Errorf("Ports = %v, want %v", result.Ports, expected)
	}
}

func TestParse_HostnameWithIP(t *testing.T) {
	raw := `Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-01-15 10:00 UTC
Nmap scan report for dc01.corp.local (10.10.10.5)
Host is up (0.032s latency).

PORT    STATE SERVICE
88/tcp  open  kerberos-sec
445/tcp open  microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 5.20 seconds`

	result, err := Parse(raw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.IP != "10.10.10.5" {
		t.Errorf("IP = %q, want %q", result.IP, "10.10.10.5")
	}

	expected := []int{88, 445}
	if !reflect.DeepEqual(result.Ports, expected) {
		t.Errorf("Ports = %v, want %v", result.Ports, expected)
	}
}

func TestParse_MixedStates(t *testing.T) {
	raw := `Nmap scan report for 192.168.1.50
Host is up (0.001s latency).

PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  filtered https
445/tcp  open     microsoft-ds
3389/tcp closed   ms-wbt-server
5985/tcp open     wsman

Nmap done: 1 IP address (1 host up) scanned in 2.10 seconds`

	result, err := Parse(raw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.IP != "192.168.1.50" {
		t.Errorf("IP = %q, want %q", result.IP, "192.168.1.50")
	}

	// Only "open" ports — filtered and closed must be excluded
	expected := []int{22, 80, 445, 5985}
	if !reflect.DeepEqual(result.Ports, expected) {
		t.Errorf("Ports = %v, want %v", result.Ports, expected)
	}
}

func TestParse_UDPPorts(t *testing.T) {
	raw := `Nmap scan report for 10.10.10.200
Host is up.

PORT    STATE SERVICE
53/udp  open  domain
88/udp  open  kerberos-sec
123/udp open  ntp
389/udp open  ldap

Nmap done: 1 IP address (1 host up) scanned in 10.00 seconds`

	result, err := Parse(raw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := []int{53, 88, 123, 389}
	if !reflect.DeepEqual(result.Ports, expected) {
		t.Errorf("Ports = %v, want %v", result.Ports, expected)
	}
}

func TestParse_DuplicatePorts(t *testing.T) {
	raw := `Nmap scan report for 10.10.10.10
Host is up.

PORT    STATE SERVICE
80/tcp  open  http
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 1.00 seconds`

	result, err := Parse(raw)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	expected := []int{80, 443}
	if !reflect.DeepEqual(result.Ports, expected) {
		t.Errorf("Ports = %v, want %v", result.Ports, expected)
	}
}

func TestParse_NoIP(t *testing.T) {
	raw := `Starting Nmap 7.94SVN
PORT    STATE SERVICE
80/tcp  open  http
Nmap done: 0 IP addresses (0 hosts up) scanned in 0.50 seconds`

	_, err := Parse(raw)
	if !errors.Is(err, ErrNoIP) {
		t.Errorf("expected ErrNoIP, got %v", err)
	}
}

func TestParse_NoOpenPorts(t *testing.T) {
	raw := `Nmap scan report for 10.10.10.99
Host is up (0.010s latency).
All 1000 scanned ports on 10.10.10.99 are closed

Nmap done: 1 IP address (1 host up) scanned in 1.50 seconds`

	_, err := Parse(raw)
	if !errors.Is(err, ErrNoPorts) {
		t.Errorf("expected ErrNoPorts, got %v", err)
	}
}

func TestParse_EmptyInput(t *testing.T) {
	_, err := Parse("")
	if err == nil {
		t.Error("expected error for empty input, got nil")
	}
}
