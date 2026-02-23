package services

import (
	"bytes"
	"io"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v3"
	"smtanbin.com/gateway/src/models"
)

// ProxyRequest forwards the incoming Fiber request to targetURL using the given
// HTTP method.  It copies the original request headers and body, injects
// authentication headers from the domain record, then streams the upstream
// response (status + headers + body) back to the caller.
func ProxyRequest(c fiber.Ctx, method, targetURL string, domain *models.DomainModel) error {
	// ── build request body ──────────────────────────────────────────────────
	var bodyReader io.Reader
	if body := c.Body(); len(body) > 0 {
		bodyReader = bytes.NewReader(body)
	}

	req, err := http.NewRequest(method, targetURL, bodyReader)
	if err != nil {
		return err
	}

	// ── propagate original headers (skip Host – http.Client sets it) ────────
	for key, values := range c.GetReqHeaders() {
		if strings.EqualFold(key, "Host") {
			continue
		}
		for _, v := range values {
			req.Header.Add(key, v)
		}
	}

	// ── inject authentication ────────────────────────────────────────────────
	applyAuth(req, domain)

	// ── execute ──────────────────────────────────────────────────────────────
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// ── relay response headers ───────────────────────────────────────────────
	for key, values := range resp.Header {
		for _, v := range values {
			c.Response().Header.Add(key, v)
		}
	}

	// ── relay status + body ──────────────────────────────────────────────────
	c.Status(resp.StatusCode)
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	return c.Send(respBody)
}

// applyAuth reads the domain's AuthType/AuthHeader/AuthToken and sets the
// appropriate outgoing header on the upstream request.
//
//	AuthType "basic" → Authorization: Basic <token>
//	AuthType "jwt"   → Authorization: Bearer <token>
//	AuthType "key"   → <AuthHeader || "X-API-Key">: <token>
func applyAuth(req *http.Request, domain *models.DomainModel) {
	if domain == nil || domain.AuthType == nil || domain.AuthToken == nil {
		return
	}

	token := *domain.AuthToken

	switch strings.ToLower(*domain.AuthType) {
	case "basic":
		req.Header.Set("Authorization", "Basic "+token)
	case "jwt":
		req.Header.Set("Authorization", "Bearer "+token)
	case "key":
		headerName := "X-API-Key"
		if domain.AuthHeader != nil && *domain.AuthHeader != "" {
			headerName = *domain.AuthHeader
		}
		req.Header.Set(headerName, token)
	default:
		// for unknown types fall back to AuthHeader if provided
		if domain.AuthHeader != nil && *domain.AuthHeader != "" {
			req.Header.Set(*domain.AuthHeader, token)
		}
	}
}
