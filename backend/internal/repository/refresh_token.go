package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"skillupp/database/sqlc"
)

type RefreshTokenRepository struct {
	q *sqlc.Queries
}

func NewRefreshTokenRepository(pool *pgxpool.Pool) *RefreshTokenRepository {
	return &RefreshTokenRepository{q: sqlc.New(pool)}
}

func (r *RefreshTokenRepository) Create(ctx context.Context, userID uuid.UUID, tokenHash string, expiresAt time.Time, userAgent string) (sqlc.RefreshToken, error) {
	return r.q.CreateRefreshToken(ctx, sqlc.CreateRefreshTokenParams{
		UserID:    userID,
		TokenHash: tokenHash,
		ExpiresAt: expiresAt,
		UserAgent: pgtype.Text{String: userAgent, Valid: userAgent != ""},
	})
}

func (r *RefreshTokenRepository) GetValid(ctx context.Context, tokenHash string) (sqlc.RefreshToken, error) {
	t, err := r.q.GetValidRefreshToken(ctx, tokenHash)
	if errors.Is(err, pgx.ErrNoRows) {
		return sqlc.RefreshToken{}, ErrNotFound
	}
	return t, err
}

func (r *RefreshTokenRepository) Revoke(ctx context.Context, id uuid.UUID) error {
	return r.q.RevokeRefreshToken(ctx, id)
}

func (r *RefreshTokenRepository) RevokeAll(ctx context.Context, userID uuid.UUID) error {
	return r.q.RevokeAllUserRefreshTokens(ctx, userID)
}
