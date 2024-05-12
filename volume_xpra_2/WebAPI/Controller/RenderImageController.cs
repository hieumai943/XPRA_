using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

[ApiController]
[Route("/render-image")]
public class RenderImageController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        var filePath = Path.Combine("../www/icons", "bgr.png");

        using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { filePath });
    }
}