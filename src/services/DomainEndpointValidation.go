package services

import (
	"errors"
	"strings"

	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

// DomainEndpointValidation checks whether a request should be blocked.
// Rules:
//   - Exact match found + active   â†’ allowed, returns the endpoint config
//   - Exact match found + inactive â†’ blocked, returns error
//   - No exact match, wildcard "*" active â†’ allowed, returns wildcard config
//   - No match at all              â†’ open by default, returns nil, nil
func DomainEndpointValidation(domainid, method, suffix string) (*models.EndpointModel, error) {
	var endpoints []models.EndpointModel

	// fetch all endpoints for this domain
	domainid = strings.ToLower(domainid)
	if err := database.DB.Where(&models.EndpointModel{DomainID: domainid}).Find(&endpoints).Error; err != nil {
		return nil, err
	}

	var wildcard *models.EndpointModel
	for i := range endpoints {
		ep := &endpoints[i]
		if ep.RequestType != method {
			continue
		}
		if ep.Endpoint == suffix {
			if !ep.Active {
				return nil, errors.New("endpoint is blocked")
			}
			return ep, nil // exact match, active â†’ allowed
		}
		if ep.Endpoint == "*" {
			wildcard = ep // keep wildcard as fallback
		}
	}

	// no exact match â€” fall back to wildcard if present and active
	if wildcard != nil {
		if !wildcard.Active {
			return nil, errors.New("endpoint is blocked")
		}
		return wildcard, nil
	}

	// no record at all â†’ open by default
	return nil, nil
}
