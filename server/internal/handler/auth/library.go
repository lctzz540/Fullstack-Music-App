package auth

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/gorm"
)

type AddToLibraryRequest struct {
	SongID uuid.UUID `json:"songID"`
	UserID uuid.UUID `json:"userID"`
}

func AddToLibraryHandler(c *fiber.Ctx) error {
	var req AddToLibraryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	user, err := getUserByID(req.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch user",
		})
	}

	song, err := getSongByID(req.SongID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to fetch song",
		})
	}

	if err := database.DB.Model(&user).Association("Library").Append(song); err != nil {
		return err
	}

	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update user's library",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Song added to library",
	})
}

func RemoveFromLibraryHandler(c *fiber.Ctx) error {
	var req struct {
		UserID string `json:"userID"`
		SongID string `json:"songID"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	userID := req.UserID
	songID := req.SongID

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

	var song model.Song
	result = database.DB.First(&song, "id = ?", songID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Song not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	if err := database.DB.Model(&user).Association("Library").Delete(&song); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to remove song from user's library",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Song removed from user's library",
	})
}

func getSongByID(songID uuid.UUID) (*model.Song, error) {
	var song model.Song
	result := database.DB.First(&song, "id = ?", songID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, errors.New("Song not found")
		}
		return nil, result.Error
	}
	return &song, nil
}

func getUserByID(userID uuid.UUID) (*model.User, error) {
	var user model.User
	result := database.DB.First(&user, "id = ?", userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, errors.New("User not found")
		}
		return nil, result.Error
	}
	return &user, nil
}

func CheckSongInLibraryHandler(c *fiber.Ctx) error {
	userID := c.Query("userID")
	songID := c.Query("songID")

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

	for _, song := range user.Library {
		if song.ID == uuid.MustParse(songID) {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "Song is present in the user's library",
			})
		}
	}

	return c.JSON(fiber.Map{
		"success": false,
		"message": "Song not found in the user's library",
	})
}
