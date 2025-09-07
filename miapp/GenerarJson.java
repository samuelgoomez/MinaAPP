package miapp; // cualquier nombre que no sea "java"

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class GenerarJson {
    public static void main(String[] args) {
        // Base path relativo desde la raíz del proyecto
        String basePath = "images";
        String outputPath = "json/fotos.json"; // en la raíz del proyecto

        StringBuilder json = new StringBuilder("{\n");

        // ---------- Pueblos ----------
        json.append("  \"pueblos\": {\n");
        String[] pueblos = {"caceres", "plasencia", "valladolid", "rincon", "torrejoncillo"};
        for (int i = 0; i < pueblos.length; i++) {
            String pueblo = pueblos[i];
            String folderPath = basePath + "/pueblos/" + pueblo;
            File folder = new File(folderPath);
            String[] fotos = folder.list((dir, name) -> name.matches(".*\\.(jpg|png|jpeg|gif)$"));
            if (fotos == null) fotos = new String[0];

            json.append("    \"").append(pueblo).append("\": {\n");
            json.append("      \"nombre\": \"").append(capitalize(pueblo)).append("\",\n");
            json.append("      \"folder\": \"").append(folderPath).append("/\",\n");
            json.append("      \"fotos\": [");
            for (int j = 0; j < fotos.length; j++) {
                json.append("\"").append(fotos[j]).append("\"");
                if (j < fotos.length - 1) json.append(", ");
            }
            json.append("]\n    }");
            if (i < pueblos.length - 1) json.append(",\n"); else json.append("\n");
        }
        json.append("  },\n");

        // ---------- Detalles ----------
        json.append("  \"detalles\": {\n");
        String detallesFolderPath = basePath + "/detalles";
        File detallesFolder = new File(detallesFolderPath);
        String[] detallesFotos = detallesFolder.list((dir, name) -> name.matches(".*\\.(jpg|png|jpeg|gif)$"));
        if (detallesFotos == null) detallesFotos = new String[0];
        json.append("    \"folder\": \"").append(detallesFolderPath).append("/\",\n");
        json.append("    \"fotos\": [");
        for (int i = 0; i < detallesFotos.length; i++) {
            json.append("\"").append(detallesFotos[i]).append("\"");
            if (i < detallesFotos.length - 1) json.append(", ");
        }
        json.append("]\n  },\n");

        // ---------- Citas ----------
        json.append("  \"citas\": {\n");
        String citasFolderPath = basePath + "/citas";
        File citasFolder = new File(citasFolderPath);
        String[] citasFotos = citasFolder.list((dir, name) -> name.matches(".*\\.(jpg|png|jpeg|gif)$"));
        if (citasFotos == null) citasFotos = new String[0];
        json.append("    \"folder\": \"").append(citasFolderPath).append("/\",\n");
        json.append("    \"fotos\": [");
        for (int i = 0; i < citasFotos.length; i++) {
            json.append("\"").append(citasFotos[i]).append("\"");
            if (i < citasFotos.length - 1) json.append(", ");
        }
        json.append("]\n  },\n");

        // ---------- Todas las fotos ----------
        json.append("  \"todas\": [");
        boolean first = true;

        for (String pueblo : pueblos) {
            File folder = new File(basePath + "/pueblos/" + pueblo);
            String[] fotos = folder.list((dir, name) -> name.matches(".*\\.(jpg|png|jpeg|gif)$"));
            if (fotos != null) {
                for (String f : fotos) {
                    if (!first) json.append(", ");
                    json.append("\"").append(basePath).append("/pueblos/").append(pueblo).append("/").append(f).append("\"");
                    first = false;
                }
            }
        }

        for (String f : detallesFotos) {
            if (!first) json.append(", ");
            json.append("\"").append(detallesFolderPath).append("/").append(f).append("\"");
            first = false;
        }

        for (String f : citasFotos) {
            if (!first) json.append(", ");
            json.append("\"").append(citasFolderPath).append("/").append(f).append("\"");
            first = false;
        }

        json.append("]\n}");

        // Crear carpeta /json en la raíz si no existe
        File jsonDir = new File("json");
        if (!jsonDir.exists()) jsonDir.mkdirs();

        try (FileWriter writer = new FileWriter(outputPath)) {
            writer.write(json.toString());
            System.out.println("fotos.json generado correctamente en " + outputPath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String capitalize(String s) {
        if (s.length() == 0) return s;
        return s.substring(0,1).toUpperCase() + s.substring(1);
    }
}
