package database

import (
	"fmt"
	"log"
	"strconv"

	"github.com/lctzz540/musicapp/config"
	"github.com/lctzz540/musicapp/internal/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	p := config.Config("DB_PORT")
	port, err := strconv.Atoi(p)
	if err != nil {
		log.Println("Failed to parse DB_PORT:", err)
		return
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"), config.Config("DB_NAME"))

	DB, err = gorm.Open(postgres.Open(dsn))
	if err != nil {
		log.Println("Failed to connect to database:", err)
		return
	}
	err = DB.AutoMigrate(&model.User{}, &model.Song{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to the database")
}
