package com.colegiolavictoria.signoaventura.servicios;

import com.colegiolavictoria.signoaventura.ResponseDto.ReporteEstudianteDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteGeneralDto;
import com.colegiolavictoria.signoaventura.ResponseDto.JugadorPorJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteDetalladoDto;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.Background;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ServicioPDF {

    @Autowired
    private ServicioReportes servicioReportes;

    public ResponseEntity<ByteArrayResource> generarPDFReporteEstudiantes() {
        try {
            List<ReporteEstudianteDto> estudiantes = servicioReportes.obtenerReporteEstudiantes();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Configurar márgenes para A4
            document.setMargins(20, 20, 20, 20);

            // Colores
            Color headerColor = new DeviceRgb(52, 73, 94);
            Color accentColor = new DeviceRgb(41, 128, 185);

            // Título principal
            Paragraph titulo = new Paragraph("📊 REPORTE DE ESTUDIANTES")
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontColor(accentColor)
                    .setMarginBottom(5);
            document.add(titulo);

            // Subtítulo con fecha
            Paragraph subtitulo = new Paragraph("Sistema de Aprendizaje - " + java.time.LocalDate.now())
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128))
                    .setMarginBottom(10);
            document.add(subtitulo);

            // Resumen estadístico
            if (!estudiantes.isEmpty()) {
                int totalEstudiantes = estudiantes.size();
                double promedioPuntuacion = estudiantes.stream().mapToDouble(e -> e.getPromedioPuntuacion()).average().orElse(0.0);
                int totalJuegos = estudiantes.stream().mapToInt(e -> e.getCantidadJuegos()).sum();

                Table resumenTable = new Table(UnitValue.createPercentArray(new float[]{33, 33, 34}))
                        .useAllAvailableWidth()
                        .setMarginBottom(10);

                addResumenCell(resumenTable, "Total Estudiantes", String.valueOf(totalEstudiantes), headerColor);
                addResumenCell(resumenTable, "Promedio Puntuación", String.format("%.2f", promedioPuntuacion), headerColor);
                addResumenCell(resumenTable, "Total Juegos Jugados", String.valueOf(totalJuegos), headerColor);

                document.add(resumenTable);
            }

            // Tabla principal
            Table table = new Table(UnitValue.createPercentArray(new float[]{8, 15, 15, 25, 12, 12, 8, 10}))
                    .useAllAvailableWidth()
                    .setMarginTop(5);

            // Encabezados con estilo
            String[] headers = {"ID", "Nombre", "Apellido", "Email", "Puntuación", "Tiempo", "Juegos", "Promedio"};
            for (String header : headers) {
                Cell headerCell = new Cell().add(new Paragraph(header).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(8))
                        .setBackgroundColor(headerColor)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(4);
                table.addHeaderCell(headerCell);
            }

            // Datos con filas alternadas
            boolean isEven = false;
            for (ReporteEstudianteDto estudiante : estudiantes) {
                Color rowColor = isEven ? new DeviceRgb(248, 249, 250) : new DeviceRgb(255, 255, 255);
                
                addDataCell(table, String.valueOf(estudiante.getIdEstudiante()), rowColor);
                addDataCell(table, estudiante.getNombre() != null ? estudiante.getNombre() : "-", rowColor);
                addDataCell(table, estudiante.getApellido() != null ? estudiante.getApellido() : "-", rowColor);
                addDataCell(table, estudiante.getEmail() != null ? estudiante.getEmail() : "-", rowColor);
                addDataCell(table, String.valueOf(estudiante.getTotalPuntuacion()), rowColor);
                addDataCell(table, estudiante.getTiempoTotal() != null ? estudiante.getTiempoTotal().toString() : "00:00:00", rowColor);
                addDataCell(table, String.valueOf(estudiante.getCantidadJuegos()), rowColor);
                addDataCell(table, String.format("%.1f", estudiante.getPromedioPuntuacion()), rowColor);
                
                isEven = !isEven;
            }

            document.add(table);

            // Pie de página
            document.add(new Paragraph("\n"));
            Paragraph piePagina = new Paragraph("Reporte generado automáticamente por el Sistema de Aprendizaje")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128));
            document.add(piePagina);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_estudiantes.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<ByteArrayResource> generarPDFReporteJuegos() {
        try {
            List<ReporteJuegoDto> juegos = servicioReportes.obtenerReporteJuegos();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(20, 20, 20, 20);

            Color headerColor = new DeviceRgb(52, 73, 94);
            Color accentColor = new DeviceRgb(46, 204, 113);

            Paragraph titulo = new Paragraph("🎮 REPORTE DE JUEGOS")
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontColor(accentColor)
                    .setMarginBottom(5);
            document.add(titulo);

            Paragraph subtitulo = new Paragraph("Sistema de Aprendizaje - " + java.time.LocalDate.now())
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128))
                    .setMarginBottom(10);
            document.add(subtitulo);

            if (!juegos.isEmpty()) {
                int totalJuegos = juegos.size();
                int juegosActivos = (int) juegos.stream().filter(j -> j.getActivo() != null && j.getActivo()).count();
                double promedioPuntuacion = juegos.stream().mapToDouble(j -> j.getPuntuacionPromedio()).average().orElse(0.0);
                int totalJugadores = juegos.stream().mapToInt(j -> j.getTotalJugadores()).sum();

                Table resumenTable = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
                        .useAllAvailableWidth()
                        .setMarginBottom(10);

                addResumenCell(resumenTable, "Total Juegos", String.valueOf(totalJuegos), headerColor);
                addResumenCell(resumenTable, "Juegos Activos", String.valueOf(juegosActivos), headerColor);
                addResumenCell(resumenTable, "Promedio Puntuación", String.format("%.2f", promedioPuntuacion), headerColor);
                addResumenCell(resumenTable, "Total Jugadores", String.valueOf(totalJugadores), headerColor);

                document.add(resumenTable);
            }

            Table table = new Table(UnitValue.createPercentArray(new float[]{8, 25, 20, 12, 10, 12, 12, 8}))
                    .useAllAvailableWidth()
                    .setMarginTop(5);

            String[] headers = {"ID", "Nombre del Juego", "Concepto", "Dificultad", "Jugadores", "Puntuación", "Tiempo", "Estado"};
            for (String header : headers) {
                Cell headerCell = new Cell().add(new Paragraph(header).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(8))
                        .setBackgroundColor(headerColor)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(4);
                table.addHeaderCell(headerCell);
            }

            boolean isEven = false;
            for (ReporteJuegoDto juego : juegos) {
                Color rowColor = isEven ? new DeviceRgb(248, 249, 250) : new DeviceRgb(255, 255, 255);
                
                addDataCell(table, String.valueOf(juego.getIdJuego()), rowColor);
                addDataCell(table, juego.getNombreJuego() != null ? juego.getNombreJuego() : "-", rowColor);
                addDataCell(table, juego.getConcepto() != null ? juego.getConcepto() : "-", rowColor);
                addDataCell(table, juego.getNivelDificultad() != null ? juego.getNivelDificultad() : "-", rowColor);
                addDataCell(table, String.valueOf(juego.getTotalJugadores()), rowColor);
                addDataCell(table, String.format("%.1f", juego.getPuntuacionPromedio()), rowColor);
                addDataCell(table, juego.getTiempoPromedio() != null ? juego.getTiempoPromedio().toString() : "00:00:00", rowColor);
                
                String estado = juego.getActivo() != null && juego.getActivo() ? "✅ Activo" : "❌ Inactivo";
                Color estadoColor = juego.getActivo() != null && juego.getActivo() ? 
                    new DeviceRgb(46, 204, 113) : new DeviceRgb(231, 76, 60);
                addDataCellWithColor(table, estado, rowColor, estadoColor);
                
                isEven = !isEven;
            }

            document.add(table);

            document.add(new Paragraph("\n"));
            Paragraph piePagina = new Paragraph("Reporte generado automáticamente por el Sistema de Aprendizaje")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128));
            document.add(piePagina);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_juegos.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<ByteArrayResource> generarPDFReporteGeneral() {
        try {
            ReporteGeneralDto reporte = servicioReportes.obtenerReporteGeneral();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(20, 20, 20, 20);

            Color headerColor = new DeviceRgb(52, 73, 94);
            Color accentColor = new DeviceRgb(155, 89, 182);

            Paragraph titulo = new Paragraph("📈 REPORTE GENERAL DEL SISTEMA")
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontColor(accentColor)
                    .setMarginBottom(5);
            document.add(titulo);

            Paragraph subtitulo = new Paragraph("Sistema de Aprendizaje - " + java.time.LocalDate.now())
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128))
                    .setMarginBottom(10);
            document.add(subtitulo);

            Table statsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            addStatCell(statsTable, "👥 Total de Estudiantes", String.valueOf(reporte.getTotalEstudiantes()), headerColor);
            addStatCell(statsTable, "🎮 Total de Juegos", String.valueOf(reporte.getTotalJuegos()), headerColor);

            addStatCell(statsTable, "📊 Total de Progresos", String.valueOf(reporte.getTotalProgresos()), headerColor);
            addStatCell(statsTable, "⭐ Puntuación Promedio", String.format("%.2f", reporte.getPuntuacionPromedio()), headerColor);

            addStatCell(statsTable, "⏱️ Tiempo Promedio", 
                (reporte.getTiempoPromedio() != null ? reporte.getTiempoPromedio().toString() : "00:00:00"), headerColor);
            addStatCell(statsTable, "📅 Fecha del Reporte", java.time.LocalDate.now().toString(), headerColor);

            document.add(statsTable);

            document.add(new Paragraph("\n"));
            Paragraph infoTitulo = new Paragraph("📋 Información del Sistema").setBold().setFontSize(14).setFontColor(accentColor);
            document.add(infoTitulo);
            document.add(new Paragraph("\n"));

            addInfoItem(document, "• El sistema cuenta con " + reporte.getTotalEstudiantes() + " estudiantes registrados");
            addInfoItem(document, "• Se han creado " + reporte.getTotalJuegos() + " juegos educativos");
            addInfoItem(document, "• Se han registrado " + reporte.getTotalProgresos() + " intentos de juego");
            addInfoItem(document, "• La puntuación promedio del sistema es de " + String.format("%.2f", reporte.getPuntuacionPromedio()) + " puntos");
            addInfoItem(document, "• El tiempo promedio por sesión es de " + 
                (reporte.getTiempoPromedio() != null ? reporte.getTiempoPromedio().toString() : "00:00:00"));

            document.add(new Paragraph("\n"));
            Paragraph piePagina = new Paragraph("Reporte generado automáticamente por el Sistema de Aprendizaje")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128));
            document.add(piePagina);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_general.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<ByteArrayResource> generarPDFReporteDetallado() {
        try {
            ReporteDetalladoDto reporte = servicioReportes.obtenerReporteDetallado();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(20, 20, 20, 20);

            Color headerColor = new DeviceRgb(52, 73, 94);
            Color accentColor = new DeviceRgb(230, 126, 34);

            Paragraph titulo = new Paragraph("📊 REPORTE DETALLADO DEL SISTEMA")
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontColor(accentColor)
                    .setMarginBottom(5);
            document.add(titulo);

            Paragraph subtitulo = new Paragraph("Sistema de Aprendizaje - " + java.time.LocalDate.now())
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128))
                    .setMarginBottom(10);
            document.add(subtitulo);

            Table mainStatsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            addStatCell(mainStatsTable, "👥 Total de Estudiantes", String.valueOf(reporte.getTotalEstudiantes()), headerColor);
            addStatCell(mainStatsTable, "🎮 Total de Juegos", String.valueOf(reporte.getTotalJuegos()), headerColor);
            addStatCell(mainStatsTable, "📊 Total de Progresos", String.valueOf(reporte.getTotalProgresos()), headerColor);
            addStatCell(mainStatsTable, "⭐ Puntuación Promedio", String.format("%.2f", reporte.getPuntuacionPromedio()), headerColor);

            document.add(mainStatsTable);

            document.add(new Paragraph("\n"));
            Paragraph puntuacionTitulo = new Paragraph("🏆 Estadísticas de Puntuación").setBold().setFontSize(14).setFontColor(accentColor);
            document.add(puntuacionTitulo);
            document.add(new Paragraph("\n"));

            Table puntuacionTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            addStatCell(puntuacionTable, "🥇 Puntuación Máxima", String.valueOf(reporte.getPuntuacionMaxima()), new DeviceRgb(46, 204, 113));
            addStatCell(puntuacionTable, "🥉 Puntuación Mínima", String.valueOf(reporte.getPuntuacionMinima()), new DeviceRgb(231, 76, 60));

            document.add(puntuacionTable);

            document.add(new Paragraph("\n"));
            Paragraph tiempoTitulo = new Paragraph("⏱️ Estadísticas de Tiempo").setBold().setFontSize(14).setFontColor(accentColor);
            document.add(tiempoTitulo);
            document.add(new Paragraph("\n"));

            Table tiempoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            addStatCell(tiempoTable, "⏰ Tiempo Promedio", 
                (reporte.getTiempoPromedio() != null ? reporte.getTiempoPromedio().toString() : "00:00:00"), new DeviceRgb(52, 152, 219));
            addStatCell(tiempoTable, "📈 Tiempo Total Acumulado", 
                (reporte.getTiempoTotal() != null ? reporte.getTiempoTotal().toString() : "00:00:00"), new DeviceRgb(155, 89, 182));

            document.add(tiempoTable);

            document.add(new Paragraph("\n"));
            Paragraph analisisTitulo = new Paragraph("📋 Análisis Detallado").setBold().setFontSize(14).setFontColor(accentColor);
            document.add(analisisTitulo);
            document.add(new Paragraph("\n"));

            addInfoItem(document, "• El sistema tiene " + reporte.getTotalEstudiantes() + " estudiantes registrados");
            addInfoItem(document, "• Se han desarrollado " + reporte.getTotalJuegos() + " juegos educativos");
            addInfoItem(document, "• Se han registrado " + reporte.getTotalProgresos() + " intentos de juego");
            addInfoItem(document, "• La puntuación promedio del sistema es de " + String.format("%.2f", reporte.getPuntuacionPromedio()) + " puntos");
            addInfoItem(document, "• La puntuación más alta registrada es de " + reporte.getPuntuacionMaxima() + " puntos");
            addInfoItem(document, "• La puntuación más baja registrada es de " + reporte.getPuntuacionMinima() + " puntos");
            addInfoItem(document, "• El tiempo promedio por sesión es de " + 
                (reporte.getTiempoPromedio() != null ? reporte.getTiempoPromedio().toString() : "00:00:00"));
            addInfoItem(document, "• El tiempo total acumulado en el sistema es de " + 
                (reporte.getTiempoTotal() != null ? reporte.getTiempoTotal().toString() : "00:00:00"));

            document.add(new Paragraph("\n"));
            Paragraph piePagina = new Paragraph("Reporte detallado generado automáticamente por el Sistema de Aprendizaje")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128));
            document.add(piePagina);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_detallado.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public ResponseEntity<ByteArrayResource> generarPDFJugadoresPorJuego(int idJuego) {
        try {
            List<JugadorPorJuegoDto> jugadores = servicioReportes.obtenerJugadoresPorJuego(idJuego);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            document.setMargins(20, 20, 20, 20);

            Color headerColor = new DeviceRgb(52, 73, 94);
            Color accentColor = new DeviceRgb(231, 76, 60);

            Paragraph titulo = new Paragraph("👥 REPORTE DE JUGADORES POR JUEGO")
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontColor(accentColor)
                    .setMarginBottom(5);
            document.add(titulo);

            Paragraph subtitulo = new Paragraph("Sistema de Aprendizaje - " + java.time.LocalDate.now())
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128))
                    .setMarginBottom(10);
            document.add(subtitulo);

            if (!jugadores.isEmpty()) {
                String nombreJuego = jugadores.get(0).getNombreJuego();
                int totalJugadores = jugadores.size();
                double promedioPuntuacion = jugadores.stream().mapToDouble(j -> j.getPuntuacion()).average().orElse(0.0);
                int puntuacionMaxima = jugadores.stream().mapToInt(j -> j.getPuntuacion()).max().orElse(0);

                Table infoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                        .useAllAvailableWidth()
                        .setMarginBottom(10);

                addStatCell(infoTable, "🎮 Juego", nombreJuego != null ? nombreJuego : "Juego #" + idJuego, headerColor);
                addStatCell(infoTable, "👥 Total Jugadores", String.valueOf(totalJugadores), headerColor);
                addStatCell(infoTable, "⭐ Puntuación Promedio", String.format("%.2f", promedioPuntuacion), headerColor);
                addStatCell(infoTable, "🏆 Puntuación Máxima", String.valueOf(puntuacionMaxima), headerColor);

                document.add(infoTable);
            }

            Table table = new Table(UnitValue.createPercentArray(new float[]{20, 20, 25, 12, 12, 15}))
                    .useAllAvailableWidth()
                    .setMarginTop(5);

            String[] headers = {"Nombre", "Apellido", "Email", "Puntuación", "Tiempo", "Fecha Intento"};
            for (String header : headers) {
                Cell headerCell = new Cell().add(new Paragraph(header).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(8))
                        .setBackgroundColor(headerColor)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(4);
                table.addHeaderCell(headerCell);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            boolean isEven = false;
            
            for (JugadorPorJuegoDto jugador : jugadores) {
                Color rowColor = isEven ? new DeviceRgb(248, 249, 250) : new DeviceRgb(255, 255, 255);
                
                addDataCell(table, jugador.getNombreEstudiante() != null ? jugador.getNombreEstudiante() : "-", rowColor);
                addDataCell(table, jugador.getApellidoEstudiante() != null ? jugador.getApellidoEstudiante() : "-", rowColor);
                addDataCell(table, jugador.getEmailEstudiante() != null ? jugador.getEmailEstudiante() : "-", rowColor);
                addDataCell(table, String.valueOf(jugador.getPuntuacion()), rowColor);
                addDataCell(table, jugador.getTiempoJugado() != null ? jugador.getTiempoJugado().toString() : "00:00:00", rowColor);
                addDataCell(table, jugador.getFechaIntento() != null ? jugador.getFechaIntento().format(formatter) : "-", rowColor);
                
                isEven = !isEven;
            }

            document.add(table);

            document.add(new Paragraph("\n"));
            Paragraph piePagina = new Paragraph("Reporte generado automáticamente por el Sistema de Aprendizaje")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(new DeviceRgb(128, 128, 128));
            document.add(piePagina);

            document.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=jugadores_juego_" + idJuego + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private void addResumenCell(Table table, String label, String value, Color headerColor) {
        Cell cell = new Cell()
                .setBackgroundColor(headerColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(6);
        
        cell.add(new Paragraph(label).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(8));
        cell.add(new Paragraph(value).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(12));
        
        table.addCell(cell);
    }

    private void addDataCell(Table table, String content, Color backgroundColor) {
        Cell cell = new Cell()
                .add(new Paragraph(content).setFontSize(7))
                .setBackgroundColor(backgroundColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(3);
        table.addCell(cell);
    }

    private void addDataCellWithColor(Table table, String content, Color backgroundColor, Color textColor) {
        Cell cell = new Cell()
                .add(new Paragraph(content).setFontColor(textColor).setBold().setFontSize(7))
                .setBackgroundColor(backgroundColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(3);
        table.addCell(cell);
    }

    private void addStatCell(Table table, String label, String value, Color headerColor) {
        Cell cell = new Cell()
                .setBackgroundColor(headerColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8);
        
        cell.add(new Paragraph(label).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(9));
        cell.add(new Paragraph(value).setBold().setFontColor(new DeviceRgb(255, 255, 255)).setFontSize(14));
        
        table.addCell(cell);
    }

    private void addInfoItem(Document document, String text) {
        Paragraph item = new Paragraph(text)
                .setFontSize(9)
                .setMarginBottom(3);
        document.add(item);
    }
}
