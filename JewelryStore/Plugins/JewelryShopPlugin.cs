using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using JewelryStore.Controllers;
using JewelryStore.Services;
using Microsoft.SemanticKernel;

namespace JewelryStore.Plugins
{
    public class JewelryShopPlugin
    {
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;
        private readonly ICartService _cartService;

        public JewelryShopPlugin(
            IProductService productService,
            IInventoryService inventoryService,
            ICartService cartService)
        {
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _inventoryService = inventoryService ?? throw new ArgumentNullException(nameof(inventoryService));
            _cartService = cartService ?? throw new ArgumentNullException(nameof(cartService));
        }

        [KernelFunction]
        [Description("Search and find jewelry products by retrieving product previews including name, material, price, and images")]
        public async Task<IEnumerable<ProductsController.ProductPreviewDto>> FindJewelry(
            [Description("Number of products to skip (for pagination)")] int skip = 0,
            [Description("Number of products to retrieve (max 200)")] int take = 20)
        {
            try
            {
                var products = await _productService.GetProductPreviewsAsync(skip, take);
                return products;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to find jewelry products: {ex.Message}", ex);
            }
        }

        [KernelFunction]
        [Description("Check inventory stock level for a specific product by product ID")]
        public async Task<string> CheckStock(
            [Description("The product ID to check stock for")] int productId)
        {
            try
            {
                var inventory = await _inventoryService.GetByProductIdAsync(productId);
                if (inventory == null)
                {
                    return $"Product {productId} not found in inventory.";
                }
                return $"Product {productId} has {inventory.Quantity} units in stock.";
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to check stock: {ex.Message}", ex);
            }
        }

        [KernelFunction]
        [Description("Add a jewelry product to the user's shopping cart")]
        public async Task<string> AddToCart(
            [Description("The product ID to add to cart")] int productId,
            [Description("The quantity to add (must be greater than 0)")] int quantity)
        {
            try
            {
                const int userId = 1; // Hardcoded user ID for now
                await _cartService.AddToCartAsync(userId, productId, quantity);
                return $"Successfully added {quantity} unit(s) of product {productId} to cart.";
            }
            catch (ArgumentException ex)
            {
                return $"Could not add to cart: {ex.Message}";
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to add product to cart: {ex.Message}", ex);
            }
        }
    }
}
