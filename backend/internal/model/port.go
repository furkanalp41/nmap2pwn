package model

// Command represents a single copy-pasteable pentesting command.
type Command struct {
	Title       string `json:"title"`
	Command     string `json:"command"`
	Description string `json:"description"`
}

// Tool represents a pentesting tool with its associated commands.
type Tool struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Commands    []Command `json:"commands"`
}

// PortData represents the full dataset for a single port.
type PortData struct {
	Port        int    `json:"port"`
	Protocol    string `json:"protocol"`
	Service     string `json:"service"`
	Description string `json:"description"`
	Tools       []Tool `json:"tools"`
}
