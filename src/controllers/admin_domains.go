package controllers

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

func RegisterAdminDomainRoutes(group fiber.Router) {
	group.Get("/domains", listDomains)
	group.Get("/domains/:id", getDomain)
	group.Post("/domains", createDomain)
	group.Put("/domains/:id", updateDomain)
	group.Delete("/domains/:id", deleteDomain)
}

func listDomains(c fiber.Ctx) error {
	var domains []models.DomainModel
	if err := database.DB.Find(&domains).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(domains)
}

func getDomain(c fiber.Ctx) error {
	id := c.Params("id")
	var domain models.DomainModel
	if err := database.DB.First(&domain, "domain_id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(domain)
}

func createDomain(c fiber.Ctx) error {
	var body models.DomainModel
	if err := c.Bind().JSON(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := database.DB.Create(&body).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(body)
}

func updateDomain(c fiber.Ctx) error {
	id := c.Params("id")
	var domain models.DomainModel
	if err := database.DB.First(&domain, "domain_id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if err := c.Bind().JSON(&domain); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := database.DB.Save(&domain).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(domain)
}

func deleteDomain(c fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.DomainModel{}, "domain_id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
