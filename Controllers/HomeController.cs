using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using form_with_grid.Models;
using Npgsql;

namespace form_with_grid.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private NpgsqlConnection conn;

    public HomeController(ILogger<HomeController> logger, NpgsqlConnection _conn)
    {
        _logger = logger;
        conn = _conn;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }


    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactModel contact)
    {
        if (contact == null)
            return BadRequest("Invalid data.");

        try
        {
            await conn.OpenAsync();

            var query = @"INSERT INTO contact_details 
                              (fname, lname, phone, email, address, state, district, city, zip) 
                              VALUES (@fname, @lname, @phone, @email, @address, @state, @district, @city, @zip)";

            using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@fname", contact.Fname ?? "");
            cmd.Parameters.AddWithValue("@lname", contact.Lname ?? "");
            cmd.Parameters.AddWithValue("@phone", contact.Phone ?? "");
            cmd.Parameters.AddWithValue("@email", contact.Email ?? "");
            cmd.Parameters.AddWithValue("@address", contact.Address ?? "");
            cmd.Parameters.AddWithValue("@state", contact.State ?? "");
            cmd.Parameters.AddWithValue("@district", contact.District ?? "");
            cmd.Parameters.AddWithValue("@city", contact.City ?? "");
            cmd.Parameters.AddWithValue("@zip", contact.Zip ?? "");

            var rowsAffected = await cmd.ExecuteNonQueryAsync();

            return Ok(new { message = "Record inserted successfully", rows = rowsAffected });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Update([FromBody] ContactModel2 contact)
    {
        if (contact == null)
            return BadRequest("Invalid data.");

        try
        {
            await conn.OpenAsync();

            var query = @"UPDATE contact_details 
                      SET fname=@fname, lname=@lname, phone=@phone, email=@email,
                          address=@address, state=@state, district=@district, city=@city, zip=@zip
                      WHERE id=@id";

            using var cmd = new NpgsqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@id", contact.recordNo);
            cmd.Parameters.AddWithValue("@fname", contact.Fname ?? "");
            cmd.Parameters.AddWithValue("@lname", contact.Lname ?? "");
            cmd.Parameters.AddWithValue("@phone", contact.Phone ?? "");
            cmd.Parameters.AddWithValue("@email", contact.Email ?? "");
            cmd.Parameters.AddWithValue("@address", contact.Address ?? "");
            cmd.Parameters.AddWithValue("@state", contact.State ?? "");
            cmd.Parameters.AddWithValue("@district", contact.District ?? "");
            cmd.Parameters.AddWithValue("@city", contact.City ?? "");
            cmd.Parameters.AddWithValue("@zip", contact.Zip ?? "");

            var rowsAffected = await cmd.ExecuteNonQueryAsync();

            if (rowsAffected == 0)
                return NotFound(new { message = "Record not found" });

            return Ok(new { message = "Record updated successfully", rows = rowsAffected });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            await conn.OpenAsync();

            var query = "SELECT id, fname, lname, phone, email, address, state, district, city, zip FROM contact_details";

            using var cmd = new NpgsqlCommand(query, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            var contacts = new List<object>();
            while (await reader.ReadAsync())
            {
                contacts.Add(new
                {
                    recordNo = reader.GetInt32(0),     // id
                    fname = reader.IsDBNull(1) ? "" : reader.GetString(1),
                    lname = reader.IsDBNull(2) ? "" : reader.GetString(2),
                    phone = reader.IsDBNull(3) ? "" : reader.GetString(3),
                    email = reader.IsDBNull(4) ? "" : reader.GetString(4),
                    address = reader.IsDBNull(5) ? "" : reader.GetString(5),
                    state = reader.IsDBNull(6) ? "" : reader.GetString(6),
                    district = reader.IsDBNull(7) ? "" : reader.GetString(7),
                    city = reader.IsDBNull(8) ? "" : reader.GetString(8),
                    zip = reader.IsDBNull(9) ? "" : reader.GetString(9)
                });
            }

            return Ok(contacts);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }



    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
