// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

interface ICarbonX {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract CarbonMarketplace {

    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;
        uint256 price;
        bool active;
    }

    uint256 public listingCount;

    ICarbonX public carbonToken;
    IERC20 public usdc;

    mapping(uint256 => Listing) public listings;

    event CreditsListed(
        uint256 indexed listingId,
        address indexed seller,
        uint256 amount,
        uint256 price
    );

    event CreditsPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount
    );

    event ListingCancelled(
        uint256 indexed listingId
    );

    constructor(
        address carbonTokenAddress,
        address usdcAddress
    ) {
        carbonToken = ICarbonX(carbonTokenAddress);
        usdc = IERC20(usdcAddress);
    }

    function listCredits(
        uint256 amount,
        uint256 price
    ) external {

        require(amount > 0, "Invalid amount");
        require(price > 0, "Invalid price");

        uint256 tokenAmount = amount * 1e18;

        require(
            carbonToken.balanceOf(msg.sender) >= tokenAmount,
            "Insufficient credits"
        );

        require(
            carbonToken.allowance(
                msg.sender,
                address(this)
            ) >= tokenAmount,
            "Approve marketplace first"
        );

        bool success = carbonToken.transferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );

        require(success, "Transfer failed");

        listingCount++;

        listings[listingCount] = Listing({
            id: listingCount,
            seller: msg.sender,
            amount: amount,
            price: price,
            active: true
        });

        emit CreditsListed(
            listingCount,
            msg.sender,
            amount,
            price
        );
    }

    function buyCredits(
        uint256 listingId
    ) external {

        require(
            listingId > 0 &&
            listingId <= listingCount,
            "Invalid listing"
        );

        Listing storage listing = listings[listingId];

        require(
            listing.active,
            "Listing inactive"
        );

        require(
            msg.sender != listing.seller,
            "Cannot buy own listing"
        );

        require(
            usdc.allowance(
                msg.sender,
                address(this)
            ) >= listing.price,
            "Approve USDC first"
        );

        bool paymentSuccess = usdc.transferFrom(
            msg.sender,
            listing.seller,
            listing.price
        );

        require(
            paymentSuccess,
            "USDC payment failed"
        );

        bool tokenSuccess = carbonToken.transfer(
            msg.sender,
            listing.amount * 1e18
        );

        require(
            tokenSuccess,
            "Token transfer failed"
        );

        listing.active = false;

        emit CreditsPurchased(
            listingId,
            msg.sender,
            listing.amount
        );
    }

    function cancelListing(
        uint256 listingId
    ) external {

        require(
            listingId > 0 &&
            listingId <= listingCount,
            "Invalid listing"
        );

        Listing storage listing = listings[listingId];

        require(
            listing.active,
            "Listing inactive"
        );

        require(
            listing.seller == msg.sender,
            "Not seller"
        );

        bool success = carbonToken.transfer(
            listing.seller,
            listing.amount * 1e18
        );

        require(
            success,
            "Return failed"
        );

        listing.active = false;

        emit ListingCancelled(
            listingId
        );
    }

    function getListing(
        uint256 listingId
    )
        external
        view
        returns (
            uint256,
            address,
            uint256,
            uint256,
            bool
        )
    {
        Listing memory listing = listings[listingId];

        return (
            listing.id,
            listing.seller,
            listing.amount,
            listing.price,
            listing.active
        );
    }
}