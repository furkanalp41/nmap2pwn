package parser

import (
	"errors"
	"regexp"
	"sort"
	"strconv"

	"github.com/nmap2pwn/backend/internal/model"
)

var (
	// Matches "Nmap scan report for 10.10.10.5" or "Nmap scan report for dc01.corp.local (10.10.10.5)"
	ipDirectRe   = regexp.MustCompile(`Nmap scan report for (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})`)
	ipParenRe    = regexp.MustCompile(`Nmap scan report for .+?\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)`)

	// Matches "445/tcp  open  microsoft-ds" or "53/udp open domain"
	portRe = regexp.MustCompile(`(\d+)/(tcp|udp)\s+open`)

	ErrNoIP    = errors.New("no target IP found in nmap output")
	ErrNoPorts = errors.New("no open ports found in nmap output")
)

// Parse extracts the target IP and open ports from raw Nmap output.
func Parse(raw string) (*model.ParseResult, error) {
	ip, err := extractIP(raw)
	if err != nil {
		return nil, err
	}

	ports, err := extractPorts(raw)
	if err != nil {
		return nil, err
	}

	return &model.ParseResult{
		IP:    ip,
		Ports: ports,
	}, nil
}

// extractIP pulls the first IP address from the Nmap scan report line.
// It checks for the "hostname (IP)" format first, then falls back to direct IP.
func extractIP(raw string) (string, error) {
	// Try parenthesized IP first: "Nmap scan report for hostname (10.10.10.5)"
	if matches := ipParenRe.FindStringSubmatch(raw); len(matches) > 1 {
		return matches[1], nil
	}

	// Fall back to direct IP: "Nmap scan report for 10.10.10.5"
	if matches := ipDirectRe.FindStringSubmatch(raw); len(matches) > 1 {
		return matches[1], nil
	}

	return "", ErrNoIP
}

// extractPorts finds all open port numbers, deduplicates and sorts them.
func extractPorts(raw string) ([]int, error) {
	matches := portRe.FindAllStringSubmatch(raw, -1)
	if len(matches) == 0 {
		return nil, ErrNoPorts
	}

	seen := make(map[int]bool)
	var ports []int

	for _, m := range matches {
		port, err := strconv.Atoi(m[1])
		if err != nil {
			continue
		}
		if !seen[port] {
			seen[port] = true
			ports = append(ports, port)
		}
	}

	sort.Ints(ports)
	return ports, nil
}
