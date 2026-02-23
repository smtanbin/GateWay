package models

import "time"

type EndpointModel struct {
	ID           string    `json:"id" gorm:"primaryKey"`
	RequestType  string    `json:"request_type"`
	Endpoint     string    `json:"endpoint"`
	DistEndpoint string    `json:"dist_endpoint"`
	DomainName   string    `json:"domain_name"`
	Active       bool      `json:"active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (EndpointModel) TableName() string {
	return "domain_endpoints"
}

func (m *EndpointModel) BeforeCreate() (err error) {
	m.CreatedAt = time.Now()
	return nil
}

func (m *EndpointModel) BeforeUpdate() (err error) {
	m.UpdatedAt = time.Now()
	return nil
}
