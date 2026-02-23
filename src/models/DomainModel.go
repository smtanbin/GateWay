package models

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DomainModel struct {
	DomainId     string  `json:"domain_id" gorm:"primaryKey"`
	DomainName   string  `json:"domain_name" uniqueIndex"`
	DomainSource string  `json:"domain_source"`
	DomainTarget string  `json:"domain_target"`
	AuthType     *string `json:"auth_type"`
	AuthHeader   *string `json:"auth_header"`
	AuthToken    *string `json:"auth_token"`
	Active       bool    `json:"active"`
	CreatedAt    string  `json:"created_at"`
	CreatedBy    string  `json:"created_by" gorm:"index;not null"`
	UpdatedAt    string  `json:"updated_at"`
	UpdatedBy    string  `json:"updated_by"`
}

func (DomainModel) TableName() string {
	return "domains"
}

func (m *DomainModel) BeforeCreate(tx *gorm.DB) (err error) {
	m.DomainId = uuid.New().String()
	m.DomainName = strings.ToLower(m.DomainName)
	m.CreatedAt = uuid.New().Time().String()

	// validate auth type
	if m.AuthType != nil && *m.AuthType != "basic" && *m.AuthType != "key" && *m.AuthType != "jwt" {
		return fmt.Errorf("invalid auth type: %s", *m.AuthType)
	}

	if m.CreatedBy == "" {
		m.CreatedBy = "system"
	}

	return nil
}

func (m *DomainModel) BeforeUpdate(tx *gorm.DB) (err error) {
	m.UpdatedAt = uuid.New().Time().String()

	return nil
}
