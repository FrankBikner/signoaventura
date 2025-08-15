package com.colegiolavictoria.signoaventura.repositorios;

import com.colegiolavictoria.signoaventura.Modelos.Estudiante;
import com.colegiolavictoria.signoaventura.Modelos.Juego;
import com.colegiolavictoria.signoaventura.Modelos.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReportesRepository extends JpaRepository<Progreso, Integer> {
    
    @Query("SELECT e.idEstudiante, u.nombre, u.apellido, u.email, e.fechaIngreso, e.fechaNacimiento, " +
           "COALESCE(SUM(p.puntuacion), 0) as totalPuntuacion, " +
           "COALESCE(SUM(EXTRACT(SECOND FROM p.tiempoJugado)), 0) as tiempoTotalSegundos, " +
           "COUNT(p) as cantidadJuegos, " +
           "COALESCE(AVG(p.puntuacion), 0) as promedioPuntuacion " +
           "FROM Estudiante e " +
           "JOIN e.usuario u " +
           "LEFT JOIN Progreso p ON e.idEstudiante = p.estudiante.idEstudiante " +
           "GROUP BY e.idEstudiante, u.nombre, u.apellido, u.email, e.fechaIngreso, e.fechaNacimiento")
    List<Object[]> obtenerReporteEstudiantes();
    
    @Query("SELECT j.idJuego, j.nombreJuego, j.descripcion, j.concepto, j.nivelDificultad, j.operador, " +
           "j.fechaCreacion, j.activo, " +
           "COUNT(DISTINCT p.estudiante.idEstudiante) as totalJugadores, " +
           "COALESCE(AVG(p.puntuacion), 0) as puntuacionPromedio, " +
           "COALESCE(AVG(EXTRACT(SECOND FROM p.tiempoJugado)), 0) as tiempoPromedioSegundos " +
           "FROM Juego j " +
           "LEFT JOIN Progreso p ON j.idJuego = p.juego.idJuego " +
           "GROUP BY j.idJuego, j.nombreJuego, j.descripcion, j.concepto, j.nivelDificultad, j.operador, j.fechaCreacion, j.activo")
    List<Object[]> obtenerReporteJuegos();
    
    @Query("SELECT p.idProgreso, u.nombre, u.apellido, u.email, p.puntuacion, p.tiempoJugado, p.fechaIntento, j.nombreJuego " +
           "FROM Progreso p " +
           "JOIN p.estudiante e " +
           "JOIN e.usuario u " +
           "JOIN p.juego j " +
           "WHERE j.idJuego = :idJuego " +
           "ORDER BY p.puntuacion DESC")
    List<Object[]> obtenerJugadoresPorJuego(@Param("idJuego") Integer idJuego);
    
    @Query("SELECT " +
           "(SELECT COUNT(e.idEstudiante) FROM Estudiante e) as totalEstudiantes, " +
           "(SELECT COUNT(j.idJuego) FROM Juego j) as totalJuegos, " +
           "(SELECT COUNT(p.idProgreso) FROM Progreso p) as totalProgresos, " +
           "(SELECT COALESCE(AVG(p.puntuacion), 0) FROM Progreso p) as puntuacionPromedio, " +
           "(SELECT COALESCE(AVG(EXTRACT(SECOND FROM p.tiempoJugado)), 0) FROM Progreso p) as tiempoPromedioSegundos")
    Object[] obtenerEstadisticasGenerales();
    
    @Query("SELECT e.idEstudiante, u.nombre, u.apellido, " +
           "COALESCE(SUM(p.puntuacion), 0) as totalPuntuacion, " +
           "COALESCE(SUM(EXTRACT(SECOND FROM p.tiempoJugado)), 0) as tiempoTotalSegundos, " +
           "COUNT(p) as cantidadJuegos " +
           "FROM Estudiante e " +
           "JOIN e.usuario u " +
           "LEFT JOIN Progreso p ON e.idEstudiante = p.estudiante.idEstudiante " +
           "GROUP BY e.idEstudiante, u.nombre, u.apellido " +
           "ORDER BY totalPuntuacion DESC " +
           "LIMIT 10")
    List<Object[]> obtenerTopEstudiantes();
    
    @Query("SELECT " +
           "(SELECT COUNT(e.idEstudiante) FROM Estudiante e) as totalEstudiantes, " +
           "(SELECT COUNT(j.idJuego) FROM Juego j) as totalJuegos, " +
           "(SELECT COUNT(p.idProgreso) FROM Progreso p) as totalProgresos, " +
           "(SELECT COALESCE(AVG(p.puntuacion), 0) FROM Progreso p) as puntuacionPromedio, " +
           "(SELECT COALESCE(AVG(EXTRACT(SECOND FROM p.tiempoJugado)), 0) FROM Progreso p) as tiempoPromedioSegundos, " +
           "(SELECT COALESCE(MAX(p.puntuacion), 0) FROM Progreso p) as puntuacionMaxima, " +
           "(SELECT COALESCE(MIN(p.puntuacion), 0) FROM Progreso p) as puntuacionMinima, " +
           "(SELECT COALESCE(SUM(EXTRACT(SECOND FROM p.tiempoJugado)), 0) FROM Progreso p) as tiempoTotalSegundos")
    Object[] obtenerReporteDetallado();
}
