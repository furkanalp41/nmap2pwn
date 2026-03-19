package handler

import (
	"net/http"
	"sort"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/nmap2pwn/backend/internal/store"
)

// PortHandler holds the store reference for port-related endpoints.
type PortHandler struct {
	Store *store.Store
}

// PortSummary is a lightweight representation for the port listing endpoint.
type PortSummary struct {
	Port        int    `json:"port"`
	Protocol    string `json:"protocol"`
	Service     string `json:"service"`
	Description string `json:"description"`
	ToolCount   int    `json:"tool_count"`
}

// ListPorts returns all available port configurations (GET /api/ports).
func (h *PortHandler) ListPorts(c *gin.Context) {
	all := h.Store.GetAllPorts()

	summaries := make([]PortSummary, 0, len(all))
	for _, pd := range all {
		summaries = append(summaries, PortSummary{
			Port:        pd.Port,
			Protocol:    pd.Protocol,
			Service:     pd.Service,
			Description: pd.Description,
			ToolCount:   len(pd.Tools),
		})
	}

	sort.Slice(summaries, func(i, j int) bool {
		return summaries[i].Port < summaries[j].Port
	})

	c.JSON(http.StatusOK, gin.H{
		"count": len(summaries),
		"ports": summaries,
	})
}

// GetPort returns the full data for a specific port (GET /api/ports/:id).
func (h *PortHandler) GetPort(c *gin.Context) {
	idStr := c.Param("id")
	port, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid port number"})
		return
	}

	pd, ok := h.Store.GetPortData(port)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "port not found in database"})
		return
	}

	c.JSON(http.StatusOK, pd)
}
