package main

import (
	"fmt"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/shivam03jain/market-server/data"
	"github.com/shivam03jain/market-server/stocks"
)

type Message struct {
	Message data.MarketInput `json:"message"`
}

func main() {
	app := fiber.New()

	// Generate initial data
	stocks.GenerateLTP()

	// Map to store last message for each client
	lastMessages := make(map[*websocket.Conn]Message)
	// Mutex for thread safety when accessing lastMessages
	var mutex sync.Mutex

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		fmt.Println("WebSocket connection opened")

		// Use a defer statement to print a message when the connection is closed
		defer func() {
			fmt.Println("WebSocket connection closed")
			mutex.Lock()
			delete(lastMessages, c)
			mutex.Unlock()
			_ = c.Close()
		}()

		// Create a ticker for periodic updates
		ticker := time.NewTicker(1 * time.Second)

		// Create a goroutine to manage the ticker
		go func() {
			defer ticker.Stop()
			for {
				select {
				case <-ticker.C:
					data.GenerateData()
					mutex.Lock()
					lastMessage := lastMessages[c]
					mutex.Unlock()
					if lastMessage.Message.Symbols != nil {
						mutex.Lock()
						err := c.WriteJSON(data.ReturnData(lastMessage.Message.Symbols))
						mutex.Unlock()
						if err != nil {
							fmt.Println("Websocket error:", err)
							return
						}
					}
				}
			}
		}()

		for {
			// Check if a new message is received from the client
			var msg Message
			if err := c.ReadJSON(&msg); err == nil {
				fmt.Println("Received new message:", msg)
				mutex.Lock()
				lastMessages[c] = msg
				mutex.Unlock()
			} else {
				// Error reading message, connection might be closed
				break
			}
		}
	}))

	app.Listen(":3001")
}
