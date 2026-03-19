package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/nmap2pwn/backend/internal/router"
	"github.com/nmap2pwn/backend/internal/store"
)

func main() {
	// Resolve data directory relative to the binary or working directory
	dataDir := os.Getenv("NMAP2PWN_DATA_DIR")
	if dataDir == "" {
		dataDir = filepath.Join("data", "ports")
	}

	// Load all port JSON files into memory
	s := store.New()
	if err := s.LoadFromDir(dataDir); err != nil {
		log.Fatalf("Failed to load port data: %v", err)
	}
	log.Printf("Loaded %d port configurations from %s", s.PortCount(), dataDir)

	// Setup router and start server
	addr := os.Getenv("NMAP2PWN_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	r := router.Setup(s)
	log.Printf("Nmap2Pwn server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
