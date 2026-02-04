const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Página principal (formulario)
  if (path === "/") {
    const html = fs.readFileSync("index.html");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  }
 
  else if (path === "/style.css") {
  const css = fs.readFileSync("style.css");
  res.writeHead(200, { "Content-Type": "text/css" });
  res.end(css);
}


  // Lógica del préstamo
  else if (path === "/prestamo") {
    const monto = Number(query.monto);
    const meses = Number(query.meses);

    if (!monto || !meses) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Faltan datos ❌</h1><a href='/'>Volver</a>");
      return;
    }

    // Reglas de negocio
    if (monto < 50000 || monto > 1000000) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Monto no permitido ❌</h1><a href='/'>Volver</a>");
      return;
    }

    let interes;
    if (meses <= 6) {
      interes = 0.08;
    } else {
      interes = 0.12;
    }

    const total = monto + monto * interes;
    const cuota = total / meses;

    // Respuesta HTML bonita
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Resultado del préstamo</title>
      </head>
      <body>
        <h1>Resultado del préstamo</h1>

        <p><strong>Monto solicitado:</strong> ${monto}</p>
        <p><strong>Meses:</strong> ${meses}</p>
        <p><strong>Interés aplicado:</strong> ${interes * 100}%</p>
        <p><strong>Cuota mensual:</strong> ${cuota.toFixed(2)}</p>

        <br>
        <a href="/">← Calcular otro préstamo</a>
      </body>
      </html>
    `);
  }

  // Cualquier otra ruta
  else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ruta no encontrada ❌");
  }
});

server.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});

