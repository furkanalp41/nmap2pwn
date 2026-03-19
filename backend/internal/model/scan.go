package model

// ParseResult holds the extracted data from raw Nmap output.
type ParseResult struct {
	IP    string `json:"ip"`
	Ports []int  `json:"ports"`
}
