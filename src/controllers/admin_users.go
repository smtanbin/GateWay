package controllers

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

func RegisterAdminUserRoutes(group fiber.Router) {
	group.Get("/users", listUsers)
	group.Get("/users/:id", getUser)
	group.Delete("/users/:id", deleteUser)
}

func listUsers(c fiber.Ctx) error {
	var users []models.UserModel
	if err := database.DB.Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(users)
}

func getUser(c fiber.Ctx) error {
	id := c.Params("id")
	var user models.UserModel
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(user)
}

func deleteUser(c fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.UserModel{}, "id = ?", id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
