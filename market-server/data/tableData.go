package data

import (
	"github.com/shivam03jain/market-server/stocks"
)

var tick float32 = 0.05

type MarketInput struct {
	Symbols []string `json:"symbols"`
}

type OutputData struct {
	Name       string       `json:"name"`
	Price      float32      `json:"price"`
	DataTable  []TableData  `json:"table"`
	DataLadder []LadderData `json:"ladder"`
	// Ask   []AskData `json:"ask"`
	// Bid   []BidData `json:"bid"`
}

type ReturnedData struct {
	Data []OutputData `json:"data"`
}

type TableData struct {
	AskQuantity int     `json:"askQuantity"`
	AskPrice    float32 `json:"askPrice"`
	BidQuantity int     `json:"bidQuantity"`
	BidPrice    float32 `json:"bidPrice"`
}

type LadderData struct {
	AskQuantity interface{} `json:"askQuantity"`
	Price       float32     `json:"price"`
	BidQuantity interface{} `json:"bidQuantity"`
}

var GeneratedData []OutputData

var FinalOutput ReturnedData

func GenerateData() {
	var tempGeneratedData []OutputData
	for _, stock := range stocks.StockPrices {
		var singleSymbolData OutputData
		singleSymbolData.Name = stock.Name
		singleSymbolData.Price = stock.Price
		var buyQuantities []int
		var sellQuantities []int
		for i := 0; i < 5; i++ {
			buyQuantities = append(buyQuantities, stocks.GenerateRandomInteger(1, 1000))
			sellQuantities = append(sellQuantities, stocks.GenerateRandomInteger(1, 1000))
		}
		var tableData []TableData
		for i := 0; i < 5; i++ {
			var table = TableData{
				BidPrice:    stock.Price - 0.05*float32(i+1),
				BidQuantity: buyQuantities[i],
				AskPrice:    stock.Price + 0.05*float32(i),
				AskQuantity: sellQuantities[i],
			}
			tableData = append(tableData, table)
		}
		singleSymbolData.DataTable = tableData
		var ladderData []LadderData
		for i := 0; i < 10; i++ {
			if i < 5 {
				var ladder = LadderData{
					BidQuantity: "-",
					Price:       stock.Price + 0.05*float32(4-i),
					AskQuantity: sellQuantities[4-i],
				}
				ladderData = append(ladderData, ladder)
			} else {
				var ladder = LadderData{
					BidQuantity: buyQuantities[i-5],
					Price:       stock.Price - 0.05*float32(i-4),
					AskQuantity: "-",
				}
				ladderData = append(ladderData, ladder)
			}
		}
		singleSymbolData.DataLadder = ladderData
		tempGeneratedData = append(tempGeneratedData, singleSymbolData)
	}
	GeneratedData = tempGeneratedData
}

func ReturnData(input []string) ReturnedData {
	// fmt.Println(input)
	var data ReturnedData
	for _, stock := range input {
		for index, allStock := range stocks.AvailableStocks {
			// fmt.Println(stock)
			if stock == allStock {
				data.Data = append(data.Data, GeneratedData[index])
				// fmt.Println(FinalOutput)
			}
		}
	}
	FinalOutput = data
	return data
}
