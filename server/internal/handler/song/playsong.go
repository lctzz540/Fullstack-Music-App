package song

import (
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v2"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"github.com/tcolgate/mp3"
	"gorm.io/gorm"
)

func StreamSong(c *fiber.Ctx) error {
	songID := c.Query("id")

	var song model.Song
	result := database.DB.First(&song, "id = ?", songID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Song not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	file, err := os.Open(song.Location)
	if err != nil {
		log.Println("Failed to open file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to open file",
		})
	}
	defer file.Close()
	filename := filepath.Base(song.Location)

	c.Set("Content-Type", "audio/mpeg")
	c.Set("Accept-Ranges", "bytes")
	c.Set("Cache-Control", "no-store")
	c.Set("Pragma", "no-cache")
	c.Set("Content-Disposition", fmt.Sprintf(`inline; filename="%s"`, filename))

	fileInfo, err := file.Stat()
	if err != nil {
		log.Println("Failed to get file info:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get file info",
		})
	}
	fileSize := fileInfo.Size()

	c.Set("Content-Length", fmt.Sprint(fileSize))

	err = c.SendFile(song.Location)
	if err != nil {
		log.Println("Failed to send file:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to send file",
		})
	}

	return nil
}

func GetDurationHandler(c *fiber.Ctx) error {
	songID := c.Query("id")

	var song model.Song
	result := database.DB.First(&song, "id = ?", songID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Song not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	duration, err := getDurationOfSong(song.Location)
	if err != nil {
		log.Println("Failed to get duration of song:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to get duration of song",
		})
	}

	return c.JSON(fiber.Map{
		"duration": duration,
	})
}

func getDurationOfSong(location string) (float64, error) {
	t := 0.0
	file, err := os.Open(location)
	if err != nil {
		return 0, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	decoder := mp3.NewDecoder(file)

	var f mp3.Frame
	skipped := 0

	for {

		if err := decoder.Decode(&f, &skipped); err != nil {
			if err == io.EOF {
				break
			}
			fmt.Println(err)
			break
		}

		t = t + f.Duration().Seconds()
	}
	return t, nil
}
