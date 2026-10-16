--name CreateUser :one
INSERT INTO users(email, password_hash, role)
VALUES($1,$2,$3)
RETURNING*;

--name GetUserByID :one
SELECT * FROM users
WHERE id =$1 AND deleted_at IS NULL;

--name GetUserByEmail :one
SELECT *FROM users
WHERE email =$1 AND deleted_at IS NULL;

--name ListUsers :many
SELECT * FROM users
WHERE delted_at IS NULL
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

--name UpdateUser :one
UPDATE users
SET email = $2,
    role= $3,
    is_active=4$,
    updated_at = NOW()
WHERE id = $1 deleted_at IS NULL,
RETURNING *;

--name SoftDeleteUser :execrows
UPDATE users
SET deleted_at =NOW(), is_active = FALSE, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;





