package controllers

import (
	"strings"

	"github.com/gofiber/fiber/v3"
	"smtanbin.com/gateway/src/services"
)

// RegisterRoutes attaches the proxy handler to the provided router group.
// It matches any method and any path under the group (wildcard) so that the
// controller can decide what to do at runtime.
func RegisterRoutes(group fiber.Router) {
	group.All("/*", ProxyContoller)
}

func ProxyContoller(c fiber.Ctx) error {
	mth := c.Method()
	path := c.Path()

	domainName, err := services.ExtractAPIPathFn(path)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid path"})
	}

	domain, err := services.DomainValidationFn(domainName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid domain"})
	}

	// split /api/<domain>/rest/of/path → suffix is everything after the domain segment
	parts := strings.SplitN(path, "/", 4) // ["", "api", "<domain>", "rest/of/path"]
	suffix := ""
	if len(parts) == 4 {
		suffix = "/" + parts[3]
	}
	_, err = services.DomainEndpointValidationFn(domain.DomainId, mth, suffix)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "endpointforbidden"})
	}

	// target always comes from the domain record
	targetBase := domain.DomainTarget

	targetURL := targetBase + suffix
	if qs := string(c.Request().URI().QueryString()); qs != "" {
		if strings.Contains(targetURL, "?") {
			targetURL += "&" + qs
		} else {
			targetURL += "?" + qs
		}
	}

	if err := services.ProxyRequest(c, mth, targetURL, domain); err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": "proxy error"})
	}

	return nil
}
