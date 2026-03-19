package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nmap2pwn/backend/internal/handler"
	"github.com/nmap2pwn/backend/internal/store"
)

// Setup creates and configures the Gin engine with all routes.
func Setup(s *store.Store) *gin.Engine {
	r := gin.Default()

	// CORS — allow all origins during development
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
	}))

	portHandler := &handler.PortHandler{Store: s}
	parseHandler := &handler.ParseHandler{Store: s}

	api := r.Group("/api")
	{
		api.GET("/health", handler.Health)
		api.GET("/ports", portHandler.ListPorts)
		api.GET("/ports/:id", portHandler.GetPort)
		api.POST("/parse", parseHandler.Parse)
	}

	return r
}
