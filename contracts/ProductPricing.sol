pragma solidity ^0.8.0;

contract ProductPricing {
    struct ProductEntry {
        string productName;
        string category;
        string description;
        uint256 price; // Price in wei (or smallest unit)
        string specifications; // JSON string
        address companyAddress;
        string signature;
        string previousTransactionHash;
        uint256 timestamp;
    }

    mapping(uint256 => ProductEntry) public products;
    uint256 public productCount;

    function addProduct(
        string memory _productName,
        string memory _category,
        string memory _description,
        uint256 _price,
        string memory _specifications,
        address _companyAddress,
        string memory _signature
    ) public returns (uint256) {
        productCount++;
        products[productCount] = ProductEntry(
            _productName,
            _category,
            _description,
            _price,
            _specifications,
            _companyAddress,
            _signature,
            "",
            block.timestamp
        );
        return productCount;
    }

    function updateProductPrice(
        uint256 _productId,
        uint256 _newPrice,
        string memory _signature,
        string memory _previousTransactionHash
    ) public {
        require(_productId <= productCount && _productId > 0, "Invalid product ID");
        ProductEntry storage product = products[_productId];
        product.price = _newPrice;
        product.signature = _signature;
        product.previousTransactionHash = _previousTransactionHash;
        product.timestamp = block.timestamp;
    }

    function getProduct(uint256 _productId) public view returns (ProductEntry memory) {
        require(_productId <= productCount && _productId > 0, "Invalid product ID");
        return products[_productId];
    }
}