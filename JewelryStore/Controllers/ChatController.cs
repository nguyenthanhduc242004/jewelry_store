using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.Google;
using JewelryStore.Plugins;

namespace JewelryStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly Kernel _kernel;
        private readonly IChatCompletionService _chatCompletionService;
        private readonly JewelryShopPlugin _jewelryShopPlugin;

        public ChatController(Kernel kernel, IChatCompletionService chatCompletionService, JewelryShopPlugin jewelryShopPlugin)
        {
            _kernel = kernel;
            _chatCompletionService = chatCompletionService;
            _jewelryShopPlugin = jewelryShopPlugin;
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var chatHistory = new ChatHistory();

            chatHistory.AddSystemMessage(
                "Bạn là nhân viên bán hàng ảo của cửa hàng trang sức 'JewelryStore'. " +
                "Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm, kiểm tra tồn kho và thêm vào giỏ hàng. " +
                "QUAN TRỌNG: " +
                "1. Chỉ trả lời dựa trên thông tin tìm thấy từ các công cụ (Plugin). " +
                "2. Không được tự bịa ra sản phẩm không có trong dữ liệu. " +
                "3. Nếu không tìm thấy sản phẩm trong dữ liệu, hãy xin lỗi và bảo khách hàng thử từ khóa khác. " +
                "4. Trả lời ngắn gọn, thân thiện, dùng tiếng Việt."
            );

            chatHistory.AddUserMessage(request.Message);

            var settings = new GeminiPromptExecutionSettings
            {
                ToolCallBehavior = GeminiToolCallBehavior.AutoInvokeKernelFunctions
            };

            try
            {
                // Import the plugin into the kernel to make its functions available
                _kernel.ImportPluginFromObject(_jewelryShopPlugin, "JewelryShop");

                var result = await _chatCompletionService.GetChatMessageContentAsync(
                    chatHistory,
                    executionSettings: settings,
                    kernel: _kernel
                );

                return Ok(new { reply = result.Content });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }

    public class ChatRequest
    {
        public required string Message { get; set; }
    }
}