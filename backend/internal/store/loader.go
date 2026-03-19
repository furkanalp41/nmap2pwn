package store

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/nmap2pwn/backend/internal/model"
)

// Store holds all port data in memory, keyed by port number.
type Store struct {
	mu   sync.RWMutex
	data map[int]model.PortData
}

// New creates an empty Store.
func New() *Store {
	return &Store{
		data: make(map[int]model.PortData),
	}
}

// LoadFromDir reads all JSON files in the given directory and caches them.
// Each file must conform to the model.PortData schema.
func (s *Store) LoadFromDir(dir string) error {
	files, err := filepath.Glob(filepath.Join(dir, "*.json"))
	if err != nil {
		return fmt.Errorf("glob data dir: %w", err)
	}

	if len(files) == 0 {
		return fmt.Errorf("no JSON files found in %s", dir)
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	for _, f := range files {
		raw, err := os.ReadFile(f)
		if err != nil {
			return fmt.Errorf("read %s: %w", f, err)
		}

		var pd model.PortData
		if err := json.Unmarshal(raw, &pd); err != nil {
			return fmt.Errorf("parse %s: %w", f, err)
		}

		s.data[pd.Port] = pd
	}

	return nil
}

// GetPortData returns the data for a specific port, or false if not found.
func (s *Store) GetPortData(port int) (model.PortData, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	pd, ok := s.data[port]
	return pd, ok
}

// GetAllPorts returns a slice of all loaded PortData entries.
func (s *Store) GetAllPorts() []model.PortData {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]model.PortData, 0, len(s.data))
	for _, pd := range s.data {
		result = append(result, pd)
	}
	return result
}

// PortCount returns the number of loaded port configurations.
func (s *Store) PortCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.data)
}
