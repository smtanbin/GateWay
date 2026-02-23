package main

import (
	"log"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/joho/godotenv"
	"smtanbin.com/gateway/src/models/database"

	// controller package alias for proxy operations
	proxy "smtanbin.com/gateway/src/controllers"
)

func main() {
	// load environment variables (optional .env file)
	if err := godotenv.Load(); err != nil {
		log.Println(".env file not found, relying on environment variables")
	}

	// initialize database (creates connection and runs migrations)
	database.Init()

	app := fiber.New(fiber.Config{
		CaseSensitive: true,
		StrictRouting: true,
		JSONEncoder:   json.Marshal,
		JSONDecoder:   json.Unmarshal,
		ServerHeader:  "Fiber",
		AppName:       "GateWay",
	})

	app.Get("/admin", func(c fiber.Ctx) error {
		return c.SendString("GateWay is running")
	})

	// CORS – allow all origins
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	// admin REST API
	admin := app.Group("/admin")
	proxy.RegisterAdminDomainRoutes(admin)
	proxy.RegisterAdminEndpointRoutes(admin)
	proxy.RegisterAdminUserRoutes(admin)
	proxy.RegisterAdminStatsRoutes(admin)

	// dynamically handle /api/* routes based on database records via a group
	api := app.Group("/api")
	proxy.RegisterRoutes(api)

	log.Fatal(app.Listen(":3000"))
}
