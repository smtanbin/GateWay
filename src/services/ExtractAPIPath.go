package services

import (
	"errors"
	"strings"
)

// ExtractAPIPath returns the portion of the URL following "/api/".  It
// trims any trailing slash and returns an error if the path does not begin
// with the expected prefix or if the resulting domain name is empty.
func ExtractAPIPath(path string) (string, error) {
	if !strings.HasPrefix(path, "/api/") {
		return "", errors.New("path must start with /api/")
	}
	p := strings.TrimPrefix(path, "/api/")
	// take only the first path segment as the domain name
	if idx := strings.Index(p, "/"); idx != -1 {
		p = p[:idx]
	}
	p = strings.TrimSuffix(p, "/")
	if p == "" {
		return "", errors.New("empty domain name")
	}
	return strings.ToLower(p), nil
}
