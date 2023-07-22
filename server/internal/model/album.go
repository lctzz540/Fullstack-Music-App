package model

import (
	"time"

	"github.com/google/uuid"
)

type Album struct {
	ID          uuid.UUID `gorm:"type:char(36);primaryKey"`
	Name        string    `gorm:"unique;size:50"`
	Image       string
	ListSong    []Song `gorm:"many2many:album_songs;"`
	ReleaseDate time.Time
}
