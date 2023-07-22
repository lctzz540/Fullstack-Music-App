package auth

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

func GetProfileHandler(c *fiber.Ctx) error {
	userID := c.Query("id")

	var user model.User
	result := database.DB.Where("id = ?", userID).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return fiber.ErrUnauthorized
		}
		log.Println("Database error:", result.Error)
		return fiber.ErrInternalServerError
	}
	response := struct {
		Email     string
		FirstName string `json:"firstname"`
		LastName  string `json:"lastname"`
	}{
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	return c.JSON(response)
}
