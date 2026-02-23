package models

import "github.com/google/uuid"

type UserModel struct {
	ID        string `json:"id" gorm:"primaryKey"`
	UserID    uint   `json:"user_id"`
	DomainId  string `json:"domain_id"`
	AuthToken string `json:"auth_token"`
	CreatedAt string `json:"created_at"`
	LastLogin string `json:"last_login"`
	UpdatedAt string `json:"updated_at"`
}

func (UserModel) TableName() string {
	return "connected_users"
}

func (m *UserModel) BeforeCreate() (err error) {
	m.ID = uuid.New().String()
	m.CreatedAt = uuid.New().Time().String()
	return nil
}

func (m *UserModel) BeforeUpdate() (err error) {
	m.UpdatedAt = uuid.New().Time().String()
	return nil
}
