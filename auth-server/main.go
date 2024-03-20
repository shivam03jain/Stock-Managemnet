package main

import (
	"log"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"github.com/shivam03jain/auth-server/models"
	postgres "github.com/shivam03jain/auth-server/storage"
	"golang.org/x/crypto/bcrypt"
)

var AvailableStocks = []string{
	"TCS",
	"RELIANCE",
	"HDFCBANK",
	"INFY",
	"ICICIBANK",
	"ITC",
	"HINDUNILVR",
	"SBIN",
	"KOTAKBANK",
	"LT",
	"HCLTECH",
	"WIPRO",
	"ONGC",
	"IOC",
	"NESTLEIND",
	"POWERGRID",
	"ULTRACEMCO",
	"MARUTI",
	"BAJAJ-AUTO",
	"NTPC",
}

var secretKey = []byte("your-secret-key")

type Repository struct {
	DB *pgxpool.Pool
}

type User struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Password  string   `json:"password"`
	Watchlist []string `json:"watchlist"`
}

type CheckUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	jwt.Claims
}

type ChangeSymbol struct {
	Symbol string `json:"symbol"`
}

func (r *Repository) RegisterUser(context *fiber.Ctx) error {
	var user User

	if err := context.BodyParser(&user); err != nil {
		return context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "request failed"})
	}

	var existingUser User
	err := r.DB.QueryRow(context.Context(), "SELECT * FROM users WHERE email = $1", user.Email).Scan(&existingUser.FirstName, &existingUser.LastName, &existingUser.Email, &existingUser.Password, &existingUser.Watchlist)
	if err == nil {
		return context.Status(http.StatusConflict).JSON(fiber.Map{"error": "Email is already in use"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error hashing password"})
	}

	var watchlist []string

	_, err = r.DB.Exec(context.Context(), "INSERT INTO users (first_name, last_name, email, password, watchlist) VALUES ($1, $2, $3, $4, $5)", user.FirstName, user.LastName, user.Email, string(hashedPassword), watchlist)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not create the user"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "User has been added"})
}

func (r *Repository) LoginUser(context *fiber.Ctx) error {
	checkUser := CheckUser{}

	err := context.BodyParser(&checkUser)
	if err != nil {
		return context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "request failed"})
	}

	var existingUser User
	err = r.DB.QueryRow(context.Context(), "SELECT * FROM users WHERE email = $1", checkUser.Email).Scan(&existingUser.FirstName, &existingUser.LastName, &existingUser.Email, &existingUser.Password, &existingUser.Watchlist)
	if err != nil {
		return context.Status(http.StatusConflict).JSON(&fiber.Map{"error": "Email is not registered."})
	}

	err = bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(checkUser.Password))
	if err != nil {
		return context.Status(http.StatusConflict).JSON(&fiber.Map{"error": "Password Doesn't match."})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, checkUser)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return context.Status(http.StatusInternalServerError).JSON(&fiber.Map{"message": "Error generating token"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"token": tokenString})
}

func (r *Repository) AddSymbol(context *fiber.Ctx) error {
	watchlist := ChangeSymbol{}

	// log.Println("Hello")

	err := context.BodyParser(&watchlist)
	if err != nil {
		return context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "request failed"})
	}

	var flag bool = true
	for _, stock := range AvailableStocks {
		if watchlist.Symbol == stock {
			flag = false
		}
	}
	if flag {
		return context.Status(http.StatusConflict).JSON(&fiber.Map{"error": "Symbol is not Available."})
	}

	email := context.Params("email")
	var existingUser User
	err = r.DB.QueryRow(context.Context(), "SELECT * FROM users WHERE email = $1", email).Scan(&existingUser.FirstName, &existingUser.LastName, &existingUser.Email, &existingUser.Password, &existingUser.Watchlist)
	if err != nil {
		return context.Status(http.StatusConflict).JSON(&fiber.Map{"error": "Email is not registered."})
	}

	flag = true
	for _, symbol := range existingUser.Watchlist {
		if symbol == watchlist.Symbol {
			flag = false
			return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Symbol already present in playlist"})
		}
	}
	if flag {
		existingUser.Watchlist = append(existingUser.Watchlist, watchlist.Symbol)
	}

	_, err = r.DB.Exec(context.Context(), "UPDATE users SET watchlist = $1 WHERE email = $2", existingUser.Watchlist, email)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not update the watchlist"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "Watchlist have been updated"})
}

func (r *Repository) Watchlist(context *fiber.Ctx) error {
	email := context.Params("email")
	var watchlist []string

	err := r.DB.QueryRow(context.Context(), "SELECT watchlist FROM users WHERE email = $1", email).Scan(&watchlist)
	if err != nil {
		return context.Status(http.StatusNotFound).JSON(&fiber.Map{"error": "Watchlist not found for the user"})
	}

	return context.JSON(&fiber.Map{"watchlist": watchlist})
}

func (r *Repository) DeleteSymbol(context *fiber.Ctx) error {
	watchlist := ChangeSymbol{}

	log.Println("Hello")

	err := context.BodyParser(&watchlist)
	if err != nil {
		return context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{"message": "request failed"})
	}

	email := context.Params("email")
	var existingUser User
	err = r.DB.QueryRow(context.Context(), "SELECT * FROM users WHERE email = $1", email).Scan(&existingUser.FirstName, &existingUser.LastName, &existingUser.Email, &existingUser.Password, &existingUser.Watchlist)
	if err != nil {
		return context.Status(http.StatusConflict).JSON(&fiber.Map{"error": "Email is not registered."})
	}

	var newWatchlist []string
	for _, symbol := range existingUser.Watchlist {
		if symbol != watchlist.Symbol {
			newWatchlist = append(newWatchlist, symbol)
		}
	}

	_, err = r.DB.Exec(context.Context(), "UPDATE users SET watchlist = $1 WHERE email = $2", newWatchlist, email)
	if err != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{"message": "Could not update the watchlist"})
	}

	return context.Status(http.StatusOK).JSON(&fiber.Map{"message": "Watchlist have been updated"})
}

func (r *Repository) SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/register", r.RegisterUser)
	api.Post("/login", r.LoginUser)
	api.Put("/addSymbol/:email", r.AddSymbol)
	api.Put("/deleteSymbol/:email", r.DeleteSymbol)
	api.Get("/watchlist/:email", r.Watchlist)
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	config := &postgres.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASS"),
		DBName:   os.Getenv("DB_NAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}

	db, err := postgres.NewConnection(config)
	if err != nil {
		log.Fatal("Could not load the Database")
	}

	defer db.Close()

	err = models.CreateTableUsers(db)
	if err != nil {
		log.Fatal("Could not create users table:", err)
	}

	r := Repository{
		DB: db,
	}

	app := fiber.New()

	app.Use(cors.New())
	r.SetupRoutes(app)

	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}
