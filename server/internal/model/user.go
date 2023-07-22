package model

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid"`
	FirstName string    `gorm:"size:20"`
	LastName  string    `gorm:"size:20"`
	Email     string    `gorm:"unique"`
	Password  string
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Library   []Song    `gorm:"many2many:user_songs;"`
}
