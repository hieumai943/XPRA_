[ApiController]
[Route("[controller]")]
public class ChangeImageController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public ImageController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost]
    public IActionResult Post(IFormFile file)
    {
        var filePath = Path.Combine(_env.WebRootPath, "icons", file.FileName);

        using (var stream = System.IO.File.Create(filePath))
        {
            file.CopyTo(stream);
        }

        return Ok(new { path = filePath });
    }
}