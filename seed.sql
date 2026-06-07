-- ============================================================
-- Script de datos mock para ecommerce_db3 (Hardware)
-- Ejecutar con: mysql -u root -p ecommerce_db3 < seed.sql
-- Contraseña de todos los usuarios: 123
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE producto_carrito;
TRUNCATE TABLE productos_categorias;
TRUNCATE TABLE usuarios_favoritos;
TRUNCATE TABLE carrito;
TRUNCATE TABLE productos;
TRUNCATE TABLE categorias;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE Clientes;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- CATEGORIAS
-- ============================================================
INSERT INTO categorias (id, nombre) VALUES
(1,  'Procesadores'),
(2,  'Placas de Video'),
(3,  'Memorias RAM'),
(4,  'Almacenamiento'),
(5,  'Motherboards'),
(6,  'Fuentes de Alimentación'),
(7,  'Gabinetes'),
(8,  'Periféricos'),
(9,  'Monitores'),
(10, 'Refrigeración');

-- ============================================================
-- PRODUCTOS
-- ============================================================
INSERT INTO productos (id, nombre, descripcion, precio, stock, foto) VALUES
-- Procesadores
(1,  'AMD Ryzen 7 7800X3D',          'Procesador 8 núcleos / 16 hilos, 4.2 GHz base, 5.0 GHz boost, 96 MB L3 cache, socket AM5.', 489999.00, 25, NULL),
(2,  'Intel Core i5-14600K',          'Procesador 14 núcleos (6P+8E) / 20 hilos, 3.5 GHz base, 5.3 GHz boost, socket LGA1700, sin cooler.', 349999.00, 30, NULL),
(3,  'AMD Ryzen 5 8600G',             'APU 6 núcleos / 12 hilos, 4.3 GHz base, 5.0 GHz boost, gráficos Radeon 760M integrados, socket AM5.', 259999.00, 40, NULL),

-- Placas de Video
(4,  'NVIDIA GeForce RTX 4070 Super', '12 GB GDDR6X, 192-bit, 1980 MHz base, 2475 MHz boost, DLSS 3, PCIe 4.0 x16.', 759999.00, 15, NULL),
(5,  'AMD Radeon RX 7800 XT',         '16 GB GDDR6, 256-bit, 2124 MHz base, 2430 MHz boost, PCIe 4.0 x16.', 649999.00, 12, NULL),
(6,  'NVIDIA GeForce RTX 4060 Ti',    '8 GB GDDR6, 128-bit, 2310 MHz base, 2535 MHz boost, DLSS 3, PCIe 4.0 x8.', 439999.00, 20, NULL),

-- Memorias RAM
(7,  'Corsair Vengeance DDR5 32 GB (2x16)',  'DDR5-6000 MHz, CL30, perfil XMP 3.0, disipador de aluminio.', 149999.00, 35, NULL),
(8,  'Kingston Fury Beast DDR4 16 GB (2x8)', 'DDR4-3200 MHz, CL16, perfil XMP 2.0, disipador low-profile.', 54999.00, 50, NULL),
(9,  'G.Skill Trident Z5 RGB DDR5 64 GB (2x32)', 'DDR5-6400 MHz, CL32, iluminación RGB addressable, disipador de aluminio.', 319999.00, 10, NULL),

-- Almacenamiento
(10, 'Samsung 990 Pro 2 TB',          'SSD NVMe M.2 PCIe 4.0 x4, lectura 7450 MB/s, escritura 6900 MB/s.', 229999.00, 30, NULL),
(11, 'WD Black SN850X 1 TB',          'SSD NVMe M.2 PCIe 4.0 x4, lectura 7300 MB/s, escritura 6300 MB/s, disipador incluido.', 139999.00, 25, NULL),
(12, 'Seagate Barracuda 4 TB',        'Disco rígido SATA III, 5400 RPM, 256 MB caché, 3.5".', 115999.00, 45, NULL),
(13, 'Kingston NV2 500 GB',           'SSD NVMe M.2 PCIe 4.0 x4, lectura 3500 MB/s, escritura 2100 MB/s.', 54999.00, 60, NULL),

-- Motherboards
(14, 'ASUS ROG Strix B650E-F Gaming', 'Socket AM5, chipset B650E, DDR5, PCIe 5.0, WiFi 6E, 4 slots M.2.', 339999.00, 18, NULL),
(15, 'MSI MAG Z790 Tomahawk WiFi',    'Socket LGA1700, chipset Z790, DDR5, PCIe 5.0, WiFi 6E, 5 slots M.2.', 409999.00, 12, NULL),
(16, 'Gigabyte B760M Aorus Elite AX', 'Socket LGA1700, chipset B760, mATX, DDR5, WiFi 6, 2 slots M.2.', 189999.00, 22, NULL),

-- Fuentes de Alimentación
(17, 'Corsair RM850x (2024)',         '850 W, 80 Plus Gold, fully modular, riel único +12V, ventilador 135 mm semi-pasivo.', 169999.00, 20, NULL),
(18, 'Seasonic Focus GX-750',         '750 W, 80 Plus Gold, fully modular, riel único +12V, ventilador 120 mm híbrido.', 139999.00, 15, NULL),
(19, 'Cooler Master MWE 650 Bronze',  '650 W, 80 Plus Bronze, semi-modular, riel único +12V, ventilador 120 mm.', 84999.00, 35, NULL),

-- Gabinetes
(20, 'Corsair 4000D Airflow',         'Mid tower ATX, panel frontal mesh, 2 ventiladores incluidos, filtro antipolvo, vidrio templado lateral.', 109999.00, 25, NULL),
(21, 'Lian Li Lancool 216',           'Mid tower ATX, panel mesh, 2 ventiladores 160 mm frontales ARGB, 1 ventilador 140 mm trasero.', 129999.00, 18, NULL),
(22, 'NZXT H5 Flow',                  'Mid tower compacta ATX, panel mesh, 2 ventiladores incluidos, gestión de cables integrada.', 104999.00, 20, NULL),

-- Periféricos
(23, 'Logitech G502 X Plus',          'Mouse inalámbrico gaming, sensor HERO 25K, 13 botones programables, RGB LIGHTSYNC, 120 h batería.', 89999.00, 40, NULL),
(24, 'HyperX Alloy Origins 65',       'Teclado mecánico 65% formato compacto, switches HyperX Red, perfil PBT, retroiluminación RGB.', 74999.00, 30, NULL),
(25, 'Corsair HS80 Max',              'Auriculares inalámbricos gaming, drivers 50 mm, micrófono omnidireccional, Dolby Atmos, 65 h batería.', 139999.00, 22, NULL),
(26, 'Razer DeathAdder V3',           'Mouse gaming ultraligero 59 g, sensor Focus Pro 30K, switches ópticos Gen 3, cable Speedflex.', 79999.00, 35, NULL),

-- Monitores
(27, 'LG UltraGear 27GP850-B',        '27" IPS QHD (2560x1440), 165 Hz, 1 ms GTG, FreeSync Premium, HDR10.', 439999.00, 15, NULL),
(28, 'Samsung Odyssey G5 32"',        '32" VA QHD (2560x1440), 144 Hz, 1 ms MPRT, FreeSync Premium, curvo 1000R.', 309999.00, 12, NULL),
(29, 'ASUS TUF Gaming VG249Q3A',      '23.8" IPS Full HD (1920x1080), 180 Hz, 1 ms MPRT, FreeSync Premium, altavoces integrados.', 239999.00, 25, NULL),

-- Refrigeración
(30, 'NZXT Kraken 360 RGB',           'Watercooler AIO 360 mm, bomba Asetek 7ma gen, ventiladores F Series RGB, display LCD 1.54".', 219999.00, 10, NULL),
(31, 'DeepCool AK620',                'Disipador torre dual con 6 heatpipes, 2 ventiladores 120 mm, 260 W TDP, sin RGB.', 59999.00, 30, NULL),
(32, 'Arctic Freezer 34 eSports DUO', 'Disipador torre dual con 4 heatpipes, 2 ventiladores P12 PWM, compatibilidad AM4/AM5 y LGA1700.', 44999.00, 40, NULL),
(33, 'ID-Cooling TF-12025 ARGB 3-pack','Kit 3 ventiladores 120 mm ARGB, 1500 RPM, 76 CFM, control PWM, pads antivibración incluidos.', 28999.00, 50, NULL);

-- ============================================================
-- PRODUCTOS_CATEGORIAS
-- ============================================================
INSERT INTO productos_categorias (producto_id, categoria_id) VALUES
-- Procesadores
(1, 1), (2, 1), (3, 1),
-- Placas de Video
(4, 2), (5, 2), (6, 2),
-- Memorias RAM
(7, 3), (8, 3), (9, 3),
-- Almacenamiento
(10, 4), (11, 4), (12, 4), (13, 4),
-- Motherboards
(14, 5), (15, 5), (16, 5),
-- Fuentes
(17, 6), (18, 6), (19, 6),
-- Gabinetes
(20, 7), (21, 7), (22, 7),
-- Periféricos
(23, 8), (24, 8), (25, 8), (26, 8),
-- Monitores
(27, 9), (28, 9), (29, 9),
-- Refrigeración
(30, 10), (31, 10), (32, 10), (33, 10);

-- ============================================================
-- USUARIOS (contraseña: 123)
-- ============================================================
INSERT INTO usuarios (id, nombre_usuario, nombre, apellido, mail, contrasena, role) VALUES
(1, 'admin',        'Carlos',    'González',   'admin@ecommerce.com',     '$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'ADMIN'),
(2, 'mlopez',       'María',     'López',      'maria.lopez@email.com',   '$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'USER'),
(3, 'jperez',       'Juan',      'Pérez',      'juan.perez@email.com',    '$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'USER'),
(4, 'lrodriguez',   'Lucía',     'Rodríguez',  'lucia.rodriguez@email.com','$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'VENDEDOR'),
(5, 'pgarcia',      'Pedro',     'García',     'pedro.garcia@email.com',   '$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'VENDEDOR'),
(6, 'amartinez',    'Ana',       'Martínez',   'ana.martinez@email.com',   '$2b$10$QsOvtRtfWBMVsrS/t/shrOmkwe0HkwXEdipCDKokjXG8yqc0PeUu.', 'USER');

-- ============================================================
-- CARRITO
-- ============================================================
INSERT INTO carrito (id, usuario_id) VALUES
(1, 2),
(2, 3),
(3, 6);

-- ============================================================
-- PRODUCTO_CARRITO
-- ============================================================
INSERT INTO producto_carrito (carrito_id, producto_id, cantidad_producto) VALUES
(1, 10, 1),  -- María: SSD Samsung 990 Pro
(1, 7, 2),   -- María: 2x RAM Corsair DDR5
(2, 4, 1),   -- Juan: RTX 4070 Super
(2, 17, 1),  -- Juan: Fuente Corsair RM850x
(2, 20, 1),  -- Juan: Gabinete Corsair 4000D
(3, 23, 1);  -- Ana: Mouse Logitech G502

-- ============================================================
-- USUARIOS_FAVORITOS
-- ============================================================
INSERT INTO usuarios_favoritos (usuario_id, producto_id) VALUES
(2, 1), (2, 27), (2, 25),      -- María: Ryzen 7, monitor LG, auris Corsair
(3, 4), (3, 14), (3, 30),      -- Juan: RTX 4070S, ASUS B650, Kraken 360
(6, 23), (6, 24), (6, 8),      -- Ana: mouse Logi, teclado HyperX, RAM Kingston
(4, 5), (4, 28);                -- Lucía: RX 7800XT, monitor Samsung
