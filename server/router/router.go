package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/lctzz540/musicapp/internal/routes/auth"
	"github.com/lctzz540/musicapp/internal/routes/song"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())
	auth.SetupAuthRoutes(api)
	song.SetupSongRoutes(api)
}
