package com.colegiolavictoria.signoaventura.servicios;

import com.colegiolavictoria.signoaventura.ResponseDto.ReporteEstudianteDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteGeneralDto;
import com.colegiolavictoria.signoaventura.ResponseDto.JugadorPorJuegoDto;
import com.colegiolavictoria.signoaventura.ResponseDto.ReporteDetalladoDto;
import com.colegiolavictoria.signoaventura.repositorios.IReportesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicioReportes {

    @Autowired
    private IReportesRepository reportesRepository;

    public List<ReporteEstudianteDto> obtenerReporteEstudiantes() {
        List<Object[]> resultados = reportesRepository.obtenerReporteEstudiantes();
        
        return resultados.stream().map(resultado -> {
            ReporteEstudianteDto dto = new ReporteEstudianteDto();
            
            dto.setIdEstudiante(convertToInt(resultado[0]));
            dto.setNombre((String) resultado[1]);
            dto.setApellido((String) resultado[2]);
            dto.setEmail((String) resultado[3]);
            dto.setFechaIngreso((java.time.LocalDate) resultado[4]);
            dto.setFechaNacimiento((java.time.LocalDate) resultado[5]);
            dto.setTotalPuntuacion(convertToInt(resultado[6]));
            
            Long segundos = convertToLong(resultado[7]);
            dto.setTiempoTotal(segundosToLocalTime(segundos));
            
            dto.setCantidadJuegos(convertToInt(resultado[8]));
            dto.setPromedioPuntuacion(convertToDouble(resultado[9]));
            
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ReporteJuegoDto> obtenerReporteJuegos() {
        List<Object[]> resultados = reportesRepository.obtenerReporteJuegos();
        
        return resultados.stream().map(resultado -> {
            ReporteJuegoDto dto = new ReporteJuegoDto();
            
            dto.setIdJuego(convertToInt(resultado[0]));
            dto.setNombreJuego((String) resultado[1]);
            dto.setDescripcion((String) resultado[2]);
            dto.setConcepto((String) resultado[3]);
            dto.setNivelDificultad(resultado[4] != null ? resultado[4].toString() : null);
            dto.setOperador(resultado[5] != null ? resultado[5].toString() : null);
            dto.setFechaCreacion((java.time.LocalDateTime) resultado[6]);
            dto.setActivo((Boolean) resultado[7]);
            dto.setTotalJugadores(convertToInt(resultado[8]));
            dto.setPuntuacionPromedio(convertToDouble(resultado[9]));
            
            Long segundos = convertToLong(resultado[10]);
            dto.setTiempoPromedio(segundosToLocalTime(segundos));
            
            return dto;
        }).collect(Collectors.toList());
    }

    public ReporteGeneralDto obtenerReporteGeneral() {
        try {
            Object[] resultado = reportesRepository.obtenerEstadisticasGenerales();
            
            ReporteGeneralDto dto = new ReporteGeneralDto();
            
            dto.setTotalEstudiantes(convertToInt(resultado[0]));
            dto.setTotalJuegos(convertToInt(resultado[1]));
            dto.setTotalProgresos(convertToInt(resultado[2]));
            dto.setPuntuacionPromedio(convertToDouble(resultado[3]));
            
            Long segundos = convertToLong(resultado[4]);
            dto.setTiempoPromedio(segundosToLocalTime(segundos));
            
            return dto;
        } catch (Exception e) {
            ReporteGeneralDto dto = new ReporteGeneralDto();
            dto.setTotalEstudiantes(0);
            dto.setTotalJuegos(0);
            dto.setTotalProgresos(0);
            dto.setPuntuacionPromedio(0.0);
            dto.setTiempoPromedio(LocalTime.of(0, 0, 0));
            return dto;
        }
    }

    public ReporteDetalladoDto obtenerReporteDetallado() {
        try {
            Object[] resultado = reportesRepository.obtenerReporteDetallado();
            
            ReporteDetalladoDto dto = new ReporteDetalladoDto();
            
            dto.setTotalEstudiantes(convertToInt(resultado[0]));
            dto.setTotalJuegos(convertToInt(resultado[1]));
            dto.setTotalProgresos(convertToInt(resultado[2]));
            dto.setPuntuacionPromedio(convertToDouble(resultado[3]));
            
            Long segundos = convertToLong(resultado[4]);
            dto.setTiempoPromedio(segundosToLocalTime(segundos));
            
            dto.setPuntuacionMaxima(convertToInt(resultado[5]));
            dto.setPuntuacionMinima(convertToInt(resultado[6]));
            
            Long segundosTotales = convertToLong(resultado[7]);
            dto.setTiempoTotal(segundosToLocalTime(segundosTotales));
            
            return dto;
        } catch (Exception e) {
            ReporteDetalladoDto dto = new ReporteDetalladoDto();
            dto.setTotalEstudiantes(0);
            dto.setTotalJuegos(0);
            dto.setTotalProgresos(0);
            dto.setPuntuacionPromedio(0.0);
            dto.setTiempoPromedio(LocalTime.of(0, 0, 0));
            dto.setPuntuacionMaxima(0);
            dto.setPuntuacionMinima(0);
            dto.setTiempoTotal(LocalTime.of(0, 0, 0));
            return dto;
        }
    }

    public List<JugadorPorJuegoDto> obtenerJugadoresPorJuego(int idJuego) {
        List<Object[]> resultados = reportesRepository.obtenerJugadoresPorJuego(idJuego);
        
        return resultados.stream().map(resultado -> {
            JugadorPorJuegoDto dto = new JugadorPorJuegoDto();
            
            dto.setIdProgreso(convertToInt(resultado[0]));
            dto.setNombreEstudiante((String) resultado[1]);
            dto.setApellidoEstudiante((String) resultado[2]);
            dto.setEmailEstudiante((String) resultado[3]);
            dto.setPuntuacion(convertToInt(resultado[4]));
            dto.setTiempoJugado((LocalTime) resultado[5]);
            dto.setFechaIntento((java.time.LocalDateTime) resultado[6]);
            dto.setNombreJuego((String) resultado[7]);
            
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ReporteEstudianteDto> obtenerTopEstudiantes() {
        List<Object[]> resultados = reportesRepository.obtenerTopEstudiantes();
        
        return resultados.stream().map(resultado -> {
            ReporteEstudianteDto dto = new ReporteEstudianteDto();
            
            dto.setIdEstudiante(convertToInt(resultado[0]));
            dto.setNombre((String) resultado[1]);
            dto.setApellido((String) resultado[2]);
            dto.setTotalPuntuacion(convertToInt(resultado[3]));
            
            Long segundos = convertToLong(resultado[4]);
            dto.setTiempoTotal(segundosToLocalTime(segundos));
            
            dto.setCantidadJuegos(convertToInt(resultado[5]));
            
            return dto;
        }).collect(Collectors.toList());
    }

    private LocalTime segundosToLocalTime(Long segundos) {
        if (segundos == null || segundos == 0) {
            return LocalTime.of(0, 0, 0);
        }
        
        long horas = segundos / 3600;
        long minutos = (segundos % 3600) / 60;
        long segs = segundos % 60;
        
        return LocalTime.of((int) horas, (int) minutos, (int) segs);
    }

    private int convertToInt(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) {
            return ((Number) obj).intValue();
        }
        try {
            return Integer.parseInt(obj.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private double convertToDouble(Object obj) {
        if (obj == null) return 0.0;
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private Long convertToLong(Object obj) {
        if (obj == null) return 0L;
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        }
        try {
            return Long.parseLong(obj.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}
