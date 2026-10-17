package repository

import "errors"

var (
	ErrNotFound    = errors.New("not found")
	ErrEmailExists = errors.New("email already exists")
)
