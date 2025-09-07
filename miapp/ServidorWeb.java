package miapp;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;

import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ServidorWeb {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        System.out.println("Servidor iniciado en http://localhost:8000");

        // Servir archivos estáticos desde la carpeta raíz del proyecto
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String path = exchange.getRequestURI().getPath();
                if (path.equals("/")) path = "/lugares.html"; // página por defecto
                File file = new File("." + path);

                if (file.exists() && !file.isDirectory()) {
                    byte[] bytes = Files.readAllBytes(file.toPath());
                    exchange.getResponseHeaders().add("Content-Type", guessContentType(path));
                    exchange.sendResponseHeaders(200, bytes.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(bytes);
                    os.close();
                } else {
                    String notFound = "404 - Archivo no encontrado";
                    exchange.sendResponseHeaders(404, notFound.length());
                    OutputStream os = exchange.getResponseBody();
                    os.write(notFound.getBytes());
                    os.close();
                }
            }
        });

        server.start();
    }

    private static String guessContentType(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }
}

