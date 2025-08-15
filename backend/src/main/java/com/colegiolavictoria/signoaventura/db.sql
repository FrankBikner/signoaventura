START TRANSACTION;

-- ROLES
INSERT INTO roles (id_rol, descripcion, nombre_rol) VALUES
  (1, 'Acceso total al sistema', 'ADMIN'),
  (2, 'Gestiona cursos y estudiantes', 'DOCENTE'),
  (3, 'Acceso a juegos y progreso', 'ESTUDIANTE');

-- USUARIOS (1 admin, 3 docentes, 24 estudiantes)
-- activo = b'1' para BIT(1)
-- contrasena = mismo hash para todos
INSERT INTO usuarios (id_usuario, activo, apellido, contrasenia, email, nombre, usuario, id_rol) VALUES
  -- Admin
  (1,   b'1', 'Pérez',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'admin@demo.edu.pe',   'María',   'admin',    1),

  -- Docentes
  (2,   b'1', 'Quispe',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'aquispe@demo.edu.pe', 'Aldo',    'aquise',   2),
  (3,   b'1', 'Huamán',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'bhuaman@demo.edu.pe', 'Beatriz', 'bhuaman',  2),
  (4,   b'1', 'Condori', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'ccondori@demo.edu.pe','Carlos',  'ccondori', 2),

  -- Estudiantes (usuarios 101–124)
  (101, b'1', 'Gómez',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'agomez@demo.edu.pe',  'Ana',      'agomez',   3),
  (102, b'1', 'Torres',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'ltorres@demo.edu.pe', 'Luis',     'ltorres',  3),
  (103, b'1', 'Ramos',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'cramos@demo.edu.pe',  'Carla',    'cramos',   3),
  (104, b'1', 'Flores',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'dflores@demo.edu.pe', 'Diego',    'dflores',  3),
  (105, b'1', 'Quispe',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'mquispe@demo.edu.pe', 'María',    'mquispe',  3),
  (106, b'1', 'Huamán',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'jhuaman@demo.edu.pe', 'José',     'jhuaman',  3),
  (107, b'1', 'Vargas',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'rvargas@demo.edu.pe', 'Rosa',     'rvargas',  3),
  (108, b'1', 'Mamani',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'pmamani@demo.edu.pe', 'Pedro',    'pmamani',  3),
  (109, b'1', 'Paredes', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'lparedes@demo.edu.pe','Lucía',    'lparedes', 3),
  (110, b'1', 'Rojas',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'mrojas@demo.edu.pe',  'Miguel',   'mrojas',   3),
  (111, b'1', 'Lara',    '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'slara@demo.edu.pe',   'Sofía',    'slara',    3),
  (112, b'1', 'Pérez',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'jperez@demo.edu.pe',  'Juan',     'jperez',   3),
  (113, b'1', 'Cruz',    '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'vcruz@demo.edu.pe',   'Valeria',  'vcruz',    3),
  (114, b'1', 'Salazar', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'ksalazar@demo.edu.pe','Kevin',    'ksalazar', 3),
  (115, b'1', 'Vega',    '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'dvega@demo.edu.pe',   'Daniela',  'dvega',    3),
  (116, b'1', 'Chávez',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'achavez@demo.edu.pe', 'Andrés',   'achavez',  3),
  (117, b'1', 'Aguilar', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'caguilar@demo.edu.pe','Camila',   'caguilar', 3),
  (118, b'1', 'Castillo','$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'bcastillo@demo.edu.pe','Bruno',   'bcastillo',3),
  (119, b'1', 'Navarro', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'pnavarro@demo.edu.pe','Paola',    'pnavarro', 3),
  (120, b'1', 'Medina',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'smedina@demo.edu.pe', 'Sergio',   'smedina',  3),
  (121, b'1', 'León',    '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'gleon@demo.edu.pe',   'Gabriela', 'gleon',    3),
  (122, b'1', 'Ponce',   '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'oponce@demo.edu.pe',  'Óscar',    'oponce',   3),
  (123, b'1', 'Romero',  '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'nromero@demo.edu.pe', 'Natalia',  'nromero',  3),
  (124, b'1', 'Mendoza', '$2a$10$IefFYnDiEOxU1Ze7ynDSdu66AjT2XEPo/wFOoarr6obbauKejRLgO', 'vmendoza@demo.edu.pe','Víctor',   'vmendoza', 3);

-- ADMINISTRADORES / DOCENTES / ESTUDIANTES
INSERT INTO administradores (id_admin, fecha_asignacion, id_usuario) VALUES
  (1, '2025-02-01 08:00:00.000000', 1);

INSERT INTO docentes (id_docente, id_usuario) VALUES
  (1, 2), (2, 3), (3, 4);

INSERT INTO estudiante (id_estudiante, fecha_ingreso, fecha_nacimiento, id_usuario) VALUES
  (1,  '2025-03-01', '2010-01-15', 101),
  (2,  '2025-03-02', '2010-02-12', 102),
  (3,  '2025-03-03', '2010-03-10', 103),
  (4,  '2025-03-04', '2010-04-08', 104),
  (5,  '2025-03-05', '2010-05-06', 105),
  (6,  '2025-03-06', '2010-06-04', 106),
  (7,  '2025-03-07', '2010-07-02', 107),
  (8,  '2025-03-08', '2010-08-20', 108),
  (9,  '2025-03-09', '2010-09-18', 109),
  (10, '2025-03-10', '2010-10-16', 110),
  (11, '2025-03-11', '2010-11-14', 111),
  (12, '2025-03-12', '2010-12-12', 112),
  (13, '2025-03-13', '2009-01-10', 113),
  (14, '2025-03-14', '2009-02-08', 114),
  (15, '2025-03-15', '2009-03-06', 115),
  (16, '2025-03-16', '2009-04-04', 116),
  (17, '2025-03-17', '2009-05-02', 117),
  (18, '2025-03-18', '2009-06-30', 118),
  (19, '2025-03-19', '2009-07-28', 119),
  (20, '2025-03-20', '2009-08-26', 120),
  (21, '2025-03-21', '2009-09-24', 121),
  (22, '2025-03-22', '2009-10-22', 122),
  (23, '2025-03-23', '2009-11-20', 123),
  (24, '2025-03-24', '2009-12-18', 124);

-- JUEGOS
INSERT INTO juego (id_juego, activo, descripcion, fecha_creacion, nivel_dificultad, nombre_juego, operador, url_imagen, url_juego, concepto) VALUES
  (1, b'1', 'Aprende el concepto de "mayor que" con una divertida carrera de autos.', NOW(), 'FACIL', 'Carrera Mayor Que', 'MAYOR', '/games/juego1/assets/images/car_blue.png', '/games/juego1/index.html', 'Mayor que (>)'),
  (2, b'1', 'Identifica grupos con menos elementos usando globos coloridos.', NOW(), 'FACIL', 'Globos Menor Que', 'MENOR', '/games/juego2/assets/images/balloon_blue.png', '/games/juego2/index.html', 'Menor que (<)'),
  (3, b'1', 'Recolecta la cantidad exacta de manzanas para aprender igualdad.', NOW(), 'FACIL', 'Manzanas Iguales', 'IGUAL', '/games/juego3/assets/images/apple.png', '/games/juego3/index_mejorado.html', 'Igual que (=)'),
  (4, b'1', 'formas cifras y despliqga el cohete.', NOW(), 'FACIL', 'Cohete mayor que', 'MAYOR', '/games/juego4/assets/images/cohete.png', '/games/juego4/index.html', 'Comparación de números');

-- PROGRESO (2 intentos por estudiante)
INSERT INTO progreso (id_progreso, fecha_intento, puntuacion, tiempo_jugado, id_estudiante, id_juego) VALUES
  (1,  '2025-07-10 10:00:00.000000', 61, '00:10:31.000000', 1,  1),
  (2,  '2025-07-10 10:05:00.000000', 62, '00:11:02.000000', 2,  1),
  (3,  '2025-07-10 10:10:00.000000', 63, '00:09:58.000000', 3,  1),
  (4,  '2025-07-10 10:15:00.000000', 64, '00:12:12.000000', 4,  1),
  (5,  '2025-07-10 10:20:00.000000', 65, '00:10:45.000000', 5,  1),
  (6,  '2025-07-10 10:25:00.000000', 66, '00:11:10.000000', 6,  1),
  (7,  '2025-07-10 10:30:00.000000', 67, '00:10:25.000000', 7,  1),
  (8,  '2025-07-10 10:35:00.000000', 68, '00:10:19.000000', 8,  1),
  (9,  '2025-07-10 10:40:00.000000', 69, '00:09:42.000000', 9,  1),
  (10, '2025-07-10 10:45:00.000000', 70, '00:11:33.000000',10,  1),
  (11, '2025-07-10 10:50:00.000000', 71, '00:10:54.000000',11,  1),
  (12, '2025-07-10 10:55:00.000000', 72, '00:12:03.000000',12,  1),
  (13, '2025-07-10 11:00:00.000000', 73, '00:10:05.000000',13,  1),
  (14, '2025-07-10 11:05:00.000000', 74, '00:10:47.000000',14,  1),
  (15, '2025-07-10 11:10:00.000000', 75, '00:11:21.000000',15,  1),
  (16, '2025-07-10 11:15:00.000000', 76, '00:09:55.000000',16,  1),
  (17, '2025-07-10 11:20:00.000000', 77, '00:10:36.000000',17,  1),
  (18, '2025-07-10 11:25:00.000000', 78, '00:10:28.000000',18,  1),
  (19, '2025-07-10 11:30:00.000000', 79, '00:11:12.000000',19,  1),
  (20, '2025-07-10 11:35:00.000000', 80, '00:10:13.000000',20,  1),
  (21, '2025-07-10 11:40:00.000000', 81, '00:10:44.000000',21,  1),
  (22, '2025-07-10 11:45:00.000000', 82, '00:09:57.000000',22,  1),
  (23, '2025-07-10 11:50:00.000000', 83, '00:11:26.000000',23,  1),
  (24, '2025-07-10 11:55:00.000000', 84, '00:10:39.000000',24,  1),

  (25, '2025-07-12 10:00:00.000000', 66, '00:09:48.000000', 1,  2),
  (26, '2025-07-12 10:05:00.000000', 67, '00:10:30.000000', 2,  2),
  (27, '2025-07-12 10:10:00.000000', 68, '00:11:05.000000', 3,  2),
  (28, '2025-07-12 10:15:00.000000', 69, '00:10:12.000000', 4,  2),
  (29, '2025-07-12 10:20:00.000000', 70, '00:09:59.000000', 5,  2),
  (30, '2025-07-12 10:25:00.000000', 71, '00:10:42.000000', 6,  2),
  (31, '2025-07-12 10:30:00.000000', 72, '00:10:28.000000', 7,  2),
  (32, '2025-07-12 10:35:00.000000', 73, '00:11:14.000000', 8,  2),
  (33, '2025-07-12 10:40:00.000000', 74, '00:10:06.000000', 9,  2),
  (34, '2025-07-12 10:45:00.000000', 75, '00:10:53.000000',10,  2),
  (35, '2025-07-12 10:50:00.000000', 76, '00:11:00.000000',11,  2),
  (36, '2025-07-12 10:55:00.000000', 77, '00:09:45.000000',12,  2),
  (37, '2025-07-12 11:00:00.000000', 78, '00:10:21.000000',13,  2),
  (38, '2025-07-12 11:05:00.000000', 79, '00:10:39.000000',14,  2),
  (39, '2025-07-12 11:10:00.000000', 80, '00:10:58.000000',15,  2),
  (40, '2025-07-12 11:15:00.000000', 81, '00:10:07.000000',16,  2),
  (41, '2025-07-12 11:20:00.000000', 82, '00:11:03.000000',17,  2),
  (42, '2025-07-12 11:25:00.000000', 83, '00:10:14.000000',18,  2),
  (43, '2025-07-12 11:30:00.000000', 84, '00:10:36.000000',19,  2),
  (44, '2025-07-12 11:35:00.000000', 85, '00:09:59.000000',20,  2),
  (45, '2025-07-12 11:40:00.000000', 86, '00:10:18.000000',21,  2),
  (46, '2025-07-12 11:45:00.000000', 87, '00:10:22.000000',22,  2),
  (47, '2025-07-12 11:50:00.000000', 88, '00:11:09.000000',23,  2),
  (48, '2025-07-12 11:55:00.000000', 89, '00:10:11.000000',24,  2);

COMMIT;

-- NOTAS:
-- * Contraseña juanito123