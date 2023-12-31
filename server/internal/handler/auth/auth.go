package auth

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/lctzz540/musicapp/database"
	"github.com/lctzz540/musicapp/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func LoginHandler(c *fiber.Ctx) error {
	email := c.FormValue("email")
	password := c.FormValue("password")

	var user model.User
	result := database.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return fiber.ErrUnauthorized
		}
		log.Println("Database error:", result.Error)
		return fiber.ErrInternalServerError
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return fiber.ErrUnauthorized
	}

	response := struct {
		Id        uuid.UUID `json:"id"`
		FirstName string    `json:"firstName"`
		LastName  string    `json:"lastName"`
		Success   bool      `json:"success"`
	}{
		Id:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Success:   true,
	}

	return c.JSON(response)
}

func SignupHandler(c *fiber.Ctx) error {
	email := c.FormValue("email")
	password := c.FormValue("password")
	firstName := c.FormValue("firstName")
	lastName := c.FormValue("lastName")

	fmt.Printf("Creating user with email: %s, password: %s, firstName: %s, lastName: %s\n", email, password, firstName, lastName)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Failed to hash password:", err)
		return fiber.ErrInternalServerError
	}

	newUser := model.User{
		ID:        uuid.New(),
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}

	result := database.DB.Create(&newUser)
	if result.Error != nil {
		log.Println("Failed to create user:", result.Error)
		return fiber.ErrInternalServerError
	}

	return c.SendString("Signup successful")
}

type UpdateUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func UpdateUserHandler(c *fiber.Ctx) error {
	userID := c.Params("userID")
	var updateUserReq UpdateUserRequest

	if err := c.BodyParser(&updateUserReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	var user model.User
	result := database.DB.First(&user, "id = ?", userID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "User not found",
			})
		}
		log.Println("Database error:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Internal Server Error",
		})
	}

	user.FirstName = updateUserReq.FirstName
	user.LastName = updateUserReq.LastName

	result = database.DB.Save(&user)
	if result.Error != nil {
		log.Println("Failed to update user:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to update user",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User updated successfully",
	})
}
