package controllers

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

func RegisterAdminEndpointRoutes(group fiber.Router) {
	group.Get("/endpoints", listEndpoints)
	group.Get("/endpoints/:id", getEndpoint)
	group.Post("/endpoints", createEndpoint)
	group.Put("/endpoints/:id", updateEndpoint)
	group.Delete("/endpoints/:id", deleteEndpoint)
}

func listEndpoints(c fiber.Ctx) error {
	var endpoints []models.EndpointModel
	db := database.DB
	// optional ?domain=<name> filter
	if domain := c.Query("domain"); domain != "" {
		db = db.Where("domain_name = ?", domain)
	}
	if err := db.Find(&endpoints).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(endpoints)
}

func getEndpoint(c fiber.Ctx) error {
	id := c.Params("id")
	var ep models.EndpointModel
	if err := database.DB.First(&ep, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(ep)
}

func createEndpoint(c fiber.Ctx) error {
	var body models.EndpointModel
	if err := c.Bind().JSON(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := database.DB.Create(&body).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(body)
}

func updateEndpoint(c fiber.Ctx) error {
	id := c.Params("id")
	var ep models.EndpointModel
	if err := database.DB.First(&ep, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if err := c.Bind().JSON(&ep); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := database.DB.Save(&ep).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(ep)
}

func deleteEndpoint(c fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.EndpointModel{}, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
