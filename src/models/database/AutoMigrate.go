package database

import (
	"log"

	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
)

// AutoMigrate applies schema migrations for all models used by the
// application. It is safe to call repeatedly.
func AutoMigrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&models.UserModel{},
		&models.EndpointModel{},
		&models.DomainModel{},
	); err != nil {
		return err
	}

	log.Println("database auto migration completed")
	return nil
}
