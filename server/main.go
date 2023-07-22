package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/router"
)

func main() {
	app := fiber.New()

	database.ConnectDB()
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		err := c.SendString("Hello world")
		return err
	})
	router.SetupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatalf("Error starting the server: %v", err)
	}
}
