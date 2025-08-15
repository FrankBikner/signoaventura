package com.colegiolavictoria.signoaventura.controladores;

import com.colegiolavictoria.signoaventura.ResponseDto.ReporteEstudianteDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteGeneralDto;
import com.colegiolavictoria.signoaventura.ResponseDto.JugadorPorJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteDetalladoDto;
import com.colegiolavictoria.signoaventura.servicios.ServicioReportes;
import com.colegiolavictoria.signoaventura.servicios.ServicioPDF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReportesController {

    @Autowired
    private ServicioReportes servicioReportes;
    
    @Autowired
    private ServicioPDF servicioPDF;

    // Endpoints para obtener datos JSON
    @GetMapping("/estudiantes")
    public ResponseEntity<List<ReporteEstudianteDto>> obtenerReporteEstudiantes() {
        List<ReporteEstudianteDto> reportes = servicioReportes.obtenerReporteEstudiantes();
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/juegos")
    public ResponseEntity<List<ReporteJuegoDto>> obtenerReporteJuegos() {
        List<ReporteJuegoDto> reportes = servicioReportes.obtenerReporteJuegos();
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/general")
    public ResponseEntity<ReporteGeneralDto> obtenerReporteGeneral() {
        ReporteGeneralDto reporte = servicioReportes.obtenerReporteGeneral();
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/jugadores-juego/{idJuego}")
    public ResponseEntity<List<JugadorPorJuegoDto>> obtenerJugadoresPorJuego(@PathVariable int idJuego) {
        List<JugadorPorJuegoDto> jugadores = servicioReportes.obtenerJugadoresPorJuego(idJuego);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/top-estudiantes")
    public ResponseEntity<List<ReporteEstudianteDto>> obtenerTopEstudiantes() {
        List<ReporteEstudianteDto> topEstudiantes = servicioReportes.obtenerTopEstudiantes();
        return ResponseEntity.ok(topEstudiantes);
    }

    @GetMapping("/detallado")
    public ResponseEntity<ReporteDetalladoDto> obtenerReporteDetallado() {
        ReporteDetalladoDto reporte = servicioReportes.obtenerReporteDetallado();
        return ResponseEntity.ok(reporte);
    }

    // Endpoints para generar PDFs
    @GetMapping("/estudiantes/pdf")
    public ResponseEntity<ByteArrayResource> generarPDFReporteEstudiantes() {
        return servicioPDF.generarPDFReporteEstudiantes();
    }

    @GetMapping("/juegos/pdf")
    public ResponseEntity<ByteArrayResource> generarPDFReporteJuegos() {
        return servicioPDF.generarPDFReporteJuegos();
    }

    @GetMapping("/general/pdf")
    public ResponseEntity<ByteArrayResource> generarPDFReporteGeneral() {
        return servicioPDF.generarPDFReporteGeneral();
    }

    @GetMapping("/detallado/pdf")
    public ResponseEntity<ByteArrayResource> generarPDFReporteDetallado() {
        return servicioPDF.generarPDFReporteDetallado();
    }

    @GetMapping("/jugadores-juego/{idJuego}/pdf")
    public ResponseEntity<ByteArrayResource> generarPDFJugadoresPorJuego(@PathVariable int idJuego) {
        return servicioPDF.generarPDFJugadoresPorJuego(idJuego);
    }
}
