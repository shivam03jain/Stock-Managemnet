package stocks

import (
	"math/rand"
)

type Stocks struct {
	Name  string
	Price float32
}

var StockPrices []Stocks

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

func GenerateLTP() {
	for _, stock := range AvailableStocks {
		stockPrice := Stocks{
			Name:  stock,
			Price: float32(GenerateRandomInteger(50, 500)),
		}
		StockPrices = append(StockPrices, stockPrice)
	}
}

func GenerateRandomInteger(min int, max int) int {
	randomInt := rand.Intn(max-min+1) + min
	return randomInt
}
