package models

import (
	"context"
	"log"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Users struct {
	FirstName *string  `json:"firstName"`
	LastName  *string  `json:"lastName"`
	Email     *string  `json:"email"`
	Password  *string  `json:"password"`
	Watchlist []string `json:"watchlist"`
}

func CreateTableUsers(db *pgxpool.Pool) error {
	_, err := db.Exec(context.Background(), `
        CREATE TABLE IF NOT EXISTS users (
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
            password VARCHAR(255),
            watchlist TEXT[]
        )
    `)
	if err != nil {
		log.Println("Error creating users table:", err)
		return err
	}

	return nil
}
