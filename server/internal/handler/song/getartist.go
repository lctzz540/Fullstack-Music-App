package song

import (
	"io/ioutil"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

type ArtistResponse struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

func GetAllArtistsHandler(c *fiber.Ctx) error {
	var artists []model.Artist

	result := database.DB.Find(&artists)
	if result.Error != nil {
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	artistResponses := make([]ArtistResponse, len(artists))
	for i, artist := range artists {
		artistResponses[i] = ArtistResponse{
			ID:   artist.ID,
			Name: artist.Name,
		}
	}

	return c.JSON(artistResponses)
}
func GetAvatarByIDHandler(c *fiber.Ctx) error {
	artistID := c.Query("id")

	artist := model.Artist{}
	err := database.DB.Where("id = ?", artistID).First(&artist).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Artist not found",
			})
		}
		log.Println("Database error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	avatarBytes, err := ioutil.ReadFile(artist.Avatar)
	if err != nil {
		log.Println("Failed to read avatar file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	c.Set("Content-Type", "image/jpeg")

	return c.Send(avatarBytes)
}
func FindArtistHandler(c *fiber.Ctx) error {
	name := c.Query("name")

	var artists []model.Artist
	query := "%" + name + "%"
	result := database.DB.Where("name ILIKE ?", query).Find(&artists)
	if result.Error != nil {
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	if len(artists) == 0 {
		log.Printf("Artist not found with name: %s\n", name)
		return c.JSON(fiber.Map{
			"message": "Artist not found",
		})
	}
	artistResponses := make([]ArtistResponse, len(artists))
	for i, artist := range artists {
		artistResponses[i] = ArtistResponse{
			ID:   artist.ID,
			Name: artist.Name,
		}
	}

	return c.JSON(artistResponses)
}
