package auth

import (
	"github.com/gofiber/fiber/v2"
	handler "github.com/lctzz540/musicapp/internal/handler/auth"
)

func SetupAuthRoutes(router fiber.Router) {
	auth := router.Group("auth")
	auth.Post("/login", handler.LoginHandler)
	auth.Post("/signup", handler.SignupHandler)
	auth.Get("/profile", handler.GetProfileHandler)
	auth.Post("/addtolibrary", handler.AddToLibraryHandler)
	auth.Get("/checksonginlibrary", handler.CheckSongInLibraryHandler)
	auth.Delete("/removefromlibrary", handler.RemoveFromLibraryHandler)
	auth.Put("/updateprofile/:userID", handler.UpdateUserHandler)
}
