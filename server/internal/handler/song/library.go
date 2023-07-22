package song

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

func GetSongsInLibrary(c *fiber.Ctx) error {
	userID := c.Query("userID")

	var user model.User
	result := database.DB.Preload("Library").First(&user, "id = ?", userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "User not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	var songResponses []SongResponse
	for _, song := range user.Library {
		songResponse := SongResponse{
			ID:    song.ID,
			Title: song.Title,
			Genre: song.Genre,
		}
		songResponses = append(songResponses, songResponse)
	}

	return c.JSON(songResponses)
}
