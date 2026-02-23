package database

import (
	"log"

	"gorm.io/gorm"
	"smtanbin.com/gateway/src/lib"
)

// DB is the globally accessible database instance. It must be initialized by
// calling Init (usually once during application startup).
var DB *gorm.DB

// Init opens a connection via the driver package and runs automigrations.
func Init() {
	if DB != nil {
		return // already initialized
	}

	DB = driver.DatabaseClient()
	if DB == nil {
		log.Fatal("database client returned nil")
	}

	if err := AutoMigrate(DB); err != nil {
		log.Fatalf("database migration failed: %v", err)
	}
}
