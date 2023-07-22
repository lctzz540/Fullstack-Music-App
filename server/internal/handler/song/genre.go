package song

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

func GetSongsByGenre(c *fiber.Ctx) error {
	genre := c.Query("genre")

	var songs []model.Song
	result := database.DB.Where("genre = ?", genre).Find(&songs)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Songs not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	var songResponses []SongResponse
	for _, song := range songs {
		songResponse := SongResponse{
			ID:    song.ID,
			Title: song.Title,
			Genre: song.Genre,
		}
		songResponses = append(songResponses, songResponse)
	}

	return c.JSON(songResponses)
}
