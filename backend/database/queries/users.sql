-- name: CreateUser :one
INSERT INTO users (email, password_hash, role)
VALUES ($1, $2, $3)
    RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL;

-- name: ListUsers :many
SELECT * FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SetUserActive :exec
UPDATE users
SET is_active = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: VerifyUserEmail :exec
UPDATE users
SET email_verified = TRUE, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteUser :execrows
UPDATE users
SET deleted_at = NOW(), is_active = FALSE, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;