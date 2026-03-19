package store

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadFromDir(t *testing.T) {
	// Create a temp dir with a test JSON file
	dir := t.TempDir()
	content := `{
		"port": 9999,
		"protocol": "tcp",
		"service": "test",
		"description": "Test service",
		"tools": [
			{
				"name": "testtool",
				"description": "A test tool",
				"commands": [
					{
						"title": "Test command",
						"command": "echo {{IP}}",
						"description": "Just a test"
					}
				]
			}
		]
	}`
	if err := os.WriteFile(filepath.Join(dir, "9999_test.json"), []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	s := New()
	if err := s.LoadFromDir(dir); err != nil {
		t.Fatalf("LoadFromDir: %v", err)
	}

	if s.PortCount() != 1 {
		t.Fatalf("PortCount = %d, want 1", s.PortCount())
	}

	pd, ok := s.GetPortData(9999)
	if !ok {
		t.Fatal("GetPortData(9999) not found")
	}
	if pd.Service != "test" {
		t.Errorf("Service = %q, want %q", pd.Service, "test")
	}
	if len(pd.Tools) != 1 || len(pd.Tools[0].Commands) != 1 {
		t.Error("unexpected tools/commands structure")
	}
}

func TestLoadFromDir_EmptyDir(t *testing.T) {
	dir := t.TempDir()
	s := New()
	if err := s.LoadFromDir(dir); err == nil {
		t.Error("expected error for empty dir, got nil")
	}
}

func TestGetPortData_NotFound(t *testing.T) {
	s := New()
	_, ok := s.GetPortData(12345)
	if ok {
		t.Error("expected not found, got ok")
	}
}

func TestGetAllPorts(t *testing.T) {
	dir := t.TempDir()
	for _, port := range []string{
		`{"port":80,"protocol":"tcp","service":"HTTP","description":"Web","tools":[]}`,
		`{"port":22,"protocol":"tcp","service":"SSH","description":"Shell","tools":[]}`,
	} {
		name := "test_" + port[8:10] + ".json"
		os.WriteFile(filepath.Join(dir, name), []byte(port), 0644)
	}

	s := New()
	if err := s.LoadFromDir(dir); err != nil {
		t.Fatal(err)
	}

	all := s.GetAllPorts()
	if len(all) != 2 {
		t.Errorf("GetAllPorts len = %d, want 2", len(all))
	}
}
