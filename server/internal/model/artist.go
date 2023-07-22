package model

import (
	"github.com/google/uuid"
)

type Artist struct {
	ID     uuid.UUID `gorm:"type:char(36);primaryKey"`
	Name   string    `gorm:"unique;size:20"`
	Avatar string
}
