package song

import (
	"io/ioutil"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

type SongResponse struct {
	ID    uuid.UUID `json:"id"`
	Title string    `json:"title"`
	Genre string    `json:"genre"`
}

func FindSongByTitleHandler(c *fiber.Ctx) error {
	songTitle := c.Query("title")

	var songs []model.Song
	result := database.DB.Where("title ILIKE ?", "%"+songTitle+"%").Find(&songs)
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
func GetSongById(c *fiber.Ctx) error {
	songID := c.Query("id")
	song := model.Song{}
	result := database.DB.First(&song, "id = ?", songID)
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
	songResponse := SongResponse{
		ID:    song.ID,
		Title: song.Title,
		Genre: song.Genre,
	}
	return c.JSON(songResponse)
}
func GetSongImage(c *fiber.Ctx) error {
	songID := c.Query("id")
	song := model.Song{}
	result := database.DB.First(&song, "id = ?", songID)
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
	SongBytes, err := ioutil.ReadFile(song.Image)
	if err != nil {
		log.Println("Failed to read song image file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	c.Set("Content-Type", "image/jpeg")

	return c.Send(SongBytes)
}

func GetSongByArtist(c *fiber.Ctx) error {
	artistID := c.Query("artist_id")
	var songs []model.Song
	result := database.DB.Where("artist_id = ?", artistID).Find(&songs)
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
func GetAllSong(c *fiber.Ctx) error {
	limit := c.Query("limit", "10")
	limitInt, err := strconv.Atoi(limit)
	if err != nil || limitInt <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid limit parameter",
		})
	}

	var songs []model.Song
	result := database.DB.Limit(limitInt).Find(&songs)
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
