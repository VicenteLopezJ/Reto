use model

SET DATEFORMAT dmy;

CREATE TABLE client (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birthday_date DATE NOT NULL,
    document_type CHAR(3) NOT NULL,
    number_document VARCHAR(20) NOT NULL UNIQUE,
    cell_number CHAR(9) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    client_type CHAR(2) NOT NULL,
    address VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL DEFAULT GETDATE(),
    is_vip BIT NOT NULL DEFAULT 0,
    state CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT chk_name CHECK (name LIKE '%[A-Za-záéíóúÁÉÍÓÚüÜñÑ ]%' AND LEN(name) >= 2),
    CONSTRAINT chk_last_name CHECK (last_name LIKE '%[A-Za-záéíóúÁÉÍÓÚüÜñÑ ]%' AND LEN(last_name) >= 2),
    CONSTRAINT chk_birthday CHECK (birthday_date < GETDATE()),
    CONSTRAINT chk_doc_type CHECK (document_type IN ('DNI', 'CNE')),
    CONSTRAINT chk_doc_num CHECK (
        (document_type = 'DNI' AND LEN(number_document) = 8) OR
        (document_type = 'CNE' AND LEN(number_document) = 20)
    ),
    CONSTRAINT chk_cell CHECK (cell_number LIKE '9[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
	CONSTRAINT chk_email CHECK ( 
        email LIKE '_%@_%._%' AND
        CHARINDEX(' ', email) = 0 AND
        CHARINDEX('..', email) = 0 AND
        LEFT(email, 1) != '@' AND
        RIGHT(email, 1) != '.'),
    CONSTRAINT chk_client_type CHECK (client_type IN ('MI', 'MA')),
    CONSTRAINT chk_state CHECK (state IN ('A', 'I'))
);







