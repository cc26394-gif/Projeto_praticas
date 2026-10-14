create table cadastro_usuario(
	id int not null identity primary key,
	cpf char(11) not null unique,
	nome varchar(100) not null,
	nascimento date not null,
	celular varchar(15),
	email varchar(50) not null unique,
	data_cadastro datetime not null default getdate(),
	data_acesso datetime null
)

create table login_no_sistema(
	id int not null identity primary key,
	usuario_id int not null references cadastro_usuario(id) unique,
	login varchar(50) not null unique,
	senha varchar(100) not null,
	data_login datetime not null default getdate()
)


create table status_reserva(
	codigo int not null identity primary key,
	status varchar(30) not null unique
)
INSERT INTO status_reserva (status)
VALUES ('Livre'), ('Ocupado'), ('Em manutenção'), ('Reservado');


create table recurso(
	codigo int not null identity primary key,
	nome varchar(50) not null,
	tipo char(1) not null check (tipo in ('L','S')),
	capacidade int not null check (capacidade > 0),
	localidade varchar(50) not null
)

create table reserva(
	id int not null identity primary key,
	recurso_cod int not null references recurso (codigo),
	usuario_id int not null references cadastro_usuario (id),
	status_cod int not null references status_reserva (codigo),
	data_inicial datetime not null,
	data_final datetime not null,
	check (data_final > data_inicial)
)
