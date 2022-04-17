-- create database pruebasSW;
-- use pruebasSW;

-- create table Agricultor(
--     usuario_Agricultor varchar(15) primary key not null,  
--     nombre_Agricultor varchar(60) not null, 
--     contrasena_Agricultor text not null, 
--     correo_Agricultor varchar(50) not null, 
--     depart_Agricultor varchar(30) not null,
--     ciudad_Agricultor varchar(30) not null,
--     tokenRC text
-- );

-- create table Analista(
--     usuario_Analista varchar(15) primary key not null, 
--     nombre_Analista varchar(50) not null,
--     correo_Analista varchar(30) not null, 
--     contraseña_Analista varchar(15) not null
-- );

-- create table Solicitud(
-- 	idSolicitud int primary key not null auto_increment,
--     estadoSolicitud varchar (25) not null,
--     usuario_Agricultor1 varchar(15) not null,
--     foreign key (usuario_Agricultor1) references Agricultor(usuario_Agricultor)
-- );

-- alter table Solicitud auto_increment = 306705;

-- create table Muestra(
-- 	idMuestra int primary key not null auto_increment,
--     cultivosActAgricultor text not null,
--     cultivosFutAgricultor text not null,
--     observacionAgricultor varchar(200),
--     estadoMuestra varchar(30) not null,
--     usuario_Analista1 varchar(15) not null,
--     idSolicitud1 int not null,
-- 	foreign key (usuario_Analista1) references Analista(usuario_Analista),
-- 	foreign key (idSolicitud1) references Solicitud(idSolicitud)
-- );

-- alter table Muestra auto_increment = 568320;

-- create table Resultado(
--     idResultado int primary key not null auto_increment,
--     fechaResultado date not null default NOW(),
--     archivoPDF text not null,
--     archivoExcel text not null,
--     idMuestra1 int not null,
--     foreign key (idMuestra1) references Muestra(idMuestra)
-- );

-- alter table Resultado auto_increment = 784525;