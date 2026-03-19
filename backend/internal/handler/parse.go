package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nmap2pwn/backend/internal/model"
	"github.com/nmap2pwn/backend/internal/parser"
	"github.com/nmap2pwn/backend/internal/store"
)

// ParseHandler holds the store reference for the parse endpoint.
type ParseHandler struct {
	Store *store.Store
}

// ParseRequest is the expected JSON body for POST /api/parse.
type ParseRequest struct {
	RawOutput string `json:"raw_output" binding:"required"`
}

// PortMatch is a single port result with its IP-substituted commands.
type PortMatch struct {
	Port        int          `json:"port"`
	Protocol    string       `json:"protocol"`
	Service     string       `json:"service"`
	Description string       `json:"description"`
	Tools       []model.Tool `json:"tools"`
}

// ParseResponse is the full response for a successful parse.
type ParseResponse struct {
	IP             string      `json:"ip"`
	OpenPorts      []int       `json:"open_ports"`
	MatchedPorts   []PortMatch `json:"matched_ports"`
	UnmatchedPorts []int       `json:"unmatched_ports"`
}

// Parse handles POST /api/parse — parses Nmap output and returns matching commands.
func (h *ParseHandler) Parse(c *gin.Context) {
	var req ParseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing or invalid 'raw_output' field"})
		return
	}

	result, err := parser.Parse(req.RawOutput)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
		return
	}

	var matched []PortMatch
	var unmatched []int

	for _, port := range result.Ports {
		pd, ok := h.Store.GetPortData(port)
		if !ok {
			unmatched = append(unmatched, port)
			continue
		}

		// Replace {{IP}} placeholder with the actual target IP
		tools := substituteIP(pd.Tools, result.IP)

		matched = append(matched, PortMatch{
			Port:        pd.Port,
			Protocol:    pd.Protocol,
			Service:     pd.Service,
			Description: pd.Description,
			Tools:       tools,
		})
	}

	c.JSON(http.StatusOK, ParseResponse{
		IP:             result.IP,
		OpenPorts:      result.Ports,
		MatchedPorts:   matched,
		UnmatchedPorts: unmatched,
	})
}

// substituteIP replaces all {{IP}} placeholders in commands with the actual IP.
func substituteIP(tools []model.Tool, ip string) []model.Tool {
	result := make([]model.Tool, len(tools))
	for i, tool := range tools {
		cmds := make([]model.Command, len(tool.Commands))
		for j, cmd := range tool.Commands {
			cmds[j] = model.Command{
				Title:       cmd.Title,
				Command:     strings.ReplaceAll(cmd.Command, "{{IP}}", ip),
				Description: cmd.Description,
			}
		}
		result[i] = model.Tool{
			Name:        tool.Name,
			Description: tool.Description,
			Commands:    cmds,
		}
	}
	return result
}
