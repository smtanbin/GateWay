package controllers

import (
	"runtime"
	"time"

	"github.com/gofiber/fiber/v3"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

var startTime = time.Now()

func RegisterAdminStatsRoutes(group fiber.Router) {
	group.Get("/stats", getStats)
}

func getStats(c fiber.Ctx) error {
	var mem runtime.MemStats
	runtime.ReadMemStats(&mem)

	var domainCount, endpointCount, userCount int64
	database.DB.Model(&models.DomainModel{}).Count(&domainCount)
	database.DB.Model(&models.EndpointModel{}).Count(&endpointCount)
	database.DB.Model(&models.UserModel{}).Count(&userCount)

	uptime := time.Since(startTime)

	return c.JSON(fiber.Map{
		"uptime_seconds": int64(uptime.Seconds()),
		"goroutines":     runtime.NumGoroutine(),
		"heap_alloc_mb":  float64(mem.HeapAlloc) / 1024 / 1024,
		"heap_sys_mb":    float64(mem.HeapSys) / 1024 / 1024,
		"gc_runs":        mem.NumGC,
		"domain_count":   domainCount,
		"endpoint_count": endpointCount,
		"user_count":     userCount,
	})
}
