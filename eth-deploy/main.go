package main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

type SolcOutput struct {
	Contracts map[string]map[string]struct {
		ABI []interface{} `json:"abi"`
		Evm struct {
			Bytecode struct {
				Object string `json:"object"`
			} `json:"bytecode"`
		} `json:"evm"`
	} `json:"contracts"`
	Errors []struct {
		Severity string `json:"severity"`
		Message  string `json:"formattedMessage"`
	} `json:"errors"`
}

func main() {
	// 1. Setup paths and context
	contractPath, err := filepath.Abs("../contracts/SimpleStorage.sol")
	if err != nil {
		log.Fatalf("Failed to resolve contract path: %v", err)
	}
	if _, err := os.Stat(contractPath); os.IsNotExist(err) {
		log.Fatalf("Contract file not found at %s", contractPath)
	}
	source, err := ioutil.ReadFile(contractPath)
	if err != nil {
		log.Fatalf("Failed to read contract file: %v", err)
	}

	// 2. Connect to Hardhat node
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := ethclient.DialContext(ctx, "http://127.0.0.1:8545")
	if err != nil {
		log.Fatalf("Failed to connect to Ethereum client: %v", err)
	}
	defer client.Close()

	chainID, err := client.NetworkID(ctx)
	if err != nil {
		log.Fatalf("Failed to get chain ID: %v", err)
	}
	fmt.Printf("Connected to network (chainId: %s)\n", chainID.String())
	blockNumber, err := client.BlockNumber(ctx)
	if err != nil {
		log.Fatalf("Failed to get block number: %v", err)
	}
	fmt.Printf("Current block number: %d\n", blockNumber)

	// 3. Setup wallet
	privateKey, err := crypto.HexToECDSA("c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3")
	if err != nil {
		log.Fatalf("Failed to parse private key: %v", err)
	}
	publicKey := privateKey.PublicKey
	address := crypto.PubkeyToAddress(publicKey)
	balance, err := client.BalanceAt(ctx, address, nil)
	if err != nil {
		log.Fatalf("Failed to get wallet balance: %v", err)
	}
	nonce, err := client.PendingNonceAt(ctx, address)
	if err != nil {
		log.Fatalf("Failed to get wallet nonce: %v", err)
	}
	fmt.Printf("Wallet address: %s\n", address.Hex())
	fmt.Printf("Wallet balance: %s ETH\n", balance.String())
	fmt.Printf("Wallet nonce (pending): %d\n", nonce)

	if balance.Sign() == 0 {
		log.Fatal("Wallet has no funds. Please fund the wallet or use a different account.")
	}

	// 4. Compile the contract
	fmt.Println("Compiling contract...")
	input := map[string]interface{}{
		"language": "Solidity",
		"sources": map[string]interface{}{
			"SimpleStorage.sol": map[string]interface{}{
				"content": string(source),
			},
		},
		"settings": map[string]interface{}{
			"outputSelection": map[string]interface{}{
				"*": map[string]interface{}{
					"*": []string{"abi", "evm.bytecode"},
				},
			},
		},
	}
	inputJSON, err := json.Marshal(input)
	if err != nil {
		log.Fatalf("Failed to marshal compilation input: %v", err)
	}

	cmd := exec.Command("solc", "--standard-json")
	cmd.Stdin = strings.NewReader(string(inputJSON))
	outputBytes, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to compile contract: %v\nOutput: %s", err, string(outputBytes))
	}

	var output SolcOutput
	if err := json.Unmarshal(outputBytes, &output); err != nil {
		log.Fatalf("Failed to parse compilation output: %v", err)
	}

	if len(output.Errors) > 0 {
		for _, errMsg := range output.Errors {
			if errMsg.Severity == "error" {
				log.Fatalf("Compilation error: %s", errMsg.Message)
			}
		}
	}

	contractOutput, exists := output.Contracts["SimpleStorage.sol"]["SimpleStorage"]
	if !exists {
		log.Fatal("Contract 'SimpleStorage' not found in compilation output.")
	}
	if contractOutput.Evm.Bytecode.Object == "" {
		log.Fatal("Bytecode not found in compilation output.")
	}
	if len(contractOutput.ABI) == 0 {
		log.Fatal("ABI not found in compilation output.")
	}

	fmt.Println("Contract compiled successfully.")
	abiJSON, err := json.MarshalIndent(contractOutput.ABI, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal ABI: %v", err)
	}
	fmt.Printf("Contract ABI: %s\n", string(abiJSON))
	fmt.Printf("Contract Bytecode (first 100 chars): %s...\n", contractOutput.Evm.Bytecode.Object[:100])

	// 5. Parse ABI and prepare deployment
	abiParsed, err := abi.JSON(strings.NewReader(string(abiJSON)))
	if err != nil {
		log.Fatalf("Failed to parse ABI: %v", err)
	}
	bytecode, err := hex.DecodeString(strings.TrimPrefix(contractOutput.Evm.Bytecode.Object, "0x"))
	if err != nil {
		log.Fatalf("Failed to decode bytecode: %v", err)
	}

	// 6. Deploy the contract
	fmt.Println("Estimating gas...")
	gasLimit, err := client.EstimateGas(ctx, ethereum.CallMsg{
		From: address,
		Data: bytecode,
	})
	if err != nil {
		log.Printf("Gas estimation failed: %v", err)
		log.Println("Using fallback gas limit of 3,000,000...")
		gasLimit = 3000000
	}
	fmt.Printf("Estimated gas: %d\n", gasLimit)

	gasPrice, err := client.SuggestGasPrice(ctx)
	if err != nil {
		log.Printf("Failed to get gas price: %v", err)
		gasPrice = big.NewInt(20000000000) // 20 gwei
	}
	fmt.Printf("Gas price: %s\n", gasPrice.String())

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		log.Fatalf("Failed to create transactor: %v", err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.GasLimit = gasLimit
	auth.GasPrice = gasPrice
	auth.Context = ctx

	fmt.Println("Deploying contract...")
	contractAddress, tx, _, err := bind.DeployContract(auth, abiParsed, bytecode, client)
	if err != nil {
		log.Fatalf("Deployment failed: %v", err)
	}
	fmt.Printf("Deployment transaction sent, hash: %s\n", tx.Hash().Hex())

	// Wait for confirmation
	fmt.Println("Waiting for deployment confirmation...")
	receipt, err := bind.WaitMined(ctx, client, tx)
	if err != nil {
		log.Fatalf("Failed to wait for deployment: %v", err)
	}
	if receipt.Status == 0 {
		log.Fatal("Deployment transaction reverted.")
	}
	fmt.Printf("Contract deployed to address: %s\n", contractAddress.Hex())

	// 7. Save ABI and address for frontend
	frontendConfigDir, err := filepath.Abs("../../src/lib/blockchain")
	if err != nil {
		log.Fatalf("Failed to resolve frontend config path: %v", err)
	}
	if err := os.MkdirAll(frontendConfigDir, 0755); err != nil {
		log.Fatalf("Failed to create frontend config directory: %v", err)
	}
	config := map[string]interface{}{
		"address": contractAddress.Hex(),
		"abi":     contractOutput.ABI,
	}
	configJSON, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal config: %v", err)
	}
	configPath := filepath.Join(frontendConfigDir, "contract-config.json")
	if err := ioutil.WriteFile(configPath, configJSON, 0644); err != nil {
		log.Fatalf("Failed to write config file: %v", err)
	}
	fmt.Printf("Saved contract config to %s\n", configPath)

	fmt.Println("Deployment script finished successfully.")
}

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}
