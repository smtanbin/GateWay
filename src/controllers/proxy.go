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
	mth := string(c.Request().Method())
	path := c.Path()

	domainName, err := services.ExtractAPIPathFn(path)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid path"})
	}

	domain, err := services.DomainValidationFn(domainName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid domain"})
	}

	suffix := strings.TrimPrefix(path, "/api/"+domainName)
	endpoint, err := services.DomainEndpointValidationFn(domain, mth, suffix)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "endpointforbidden"})
	}

	// choose base target: endpoint-level dist endpoint takes precedence over
	// the domain's default target.
	targetBase := domain.DomainTarget
	if endpoint != nil && endpoint.DistEndpoint != "" {
		targetBase = endpoint.DistEndpoint
	}

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
