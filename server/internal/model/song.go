package model

import "github.com/google/uuid"

type Song struct {
	ID       uuid.UUID `gorm:"type:uuid"`
	Title    string    `gorm:"size:50"`
	ArtistID uuid.UUID
	Artist   Artist `gorm:"foreignKey:ArtistID;size:20"`
	Album    string
	Genre    string `gorm:"size:10"`
	Image    string
	Location string
}
