package services

import (
	"errors"

	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

// DomainEndpointValidation looks for an endpoint record that matches the
// provided domain, HTTP method and request path.  It returns the endpoint
// model (which contains the dist endpoint URL) or an error.
func DomainEndpointValidation(domain *models.DomainModel, method, suffix string) (*models.EndpointModel, error) {
	ep := &models.EndpointModel{}
	// query active endpoints for this domain/method; allow wildcard "*".
	err := database.DB.Where("domain_name = ? AND request_type = ? AND active = ?", domain.DomainName, method, true).
		Where("endpoint = ? OR endpoint = '*'", suffix).
		Order("endpoint DESC"). // ensures concrete paths are preferred over '*'
		First(ep).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("not found")
		}
		return nil, err
	}

	// successful lookup
	return ep, nil
}
