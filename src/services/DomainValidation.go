package services

import (
	"errors"
	"strings"

	"gorm.io/gorm"
	"smtanbin.com/gateway/src/models"
	"smtanbin.com/gateway/src/models/database"
)

// the exported variables are indirections that make it easy for tests to
// substitute fake implementations without touching the production code.
var (
	ExtractAPIPathFn           = ExtractAPIPath
	DomainValidationFn         = DomainValidation
	DomainEndpointValidationFn = DomainEndpointValidation
)

// DomainValidation performs a lookup of the provided domain name and
// returns the corresponding record if it exists and is active.  The caller
// may inspect the returned model for the ID and authentication fields and
// translate the error into HTTP status codes.
func DomainValidation(name string) (*models.DomainModel, error) {
	d := &models.DomainModel{}
	if err := database.DB.Where(&models.DomainModel{DomainName: strings.ToLower(name)}).First(d).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("not found")
		}
		return nil, err
	}

	if !d.Active {
		return nil, errors.New("inactive")
	}

	return d, nil
}
