DROP TABLE IF EXISTS `PATIENT`;

CREATE TABLE `PATIENT` (
    `patient_id` VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(50),
    `address` VARCHAR(255),
    `city_of_residence` VARCHAR(255),
    `nationality` VARCHAR(100),
    `birth_date` DATE NOT NULL,
    `tax_code` VARCHAR(100) NOT NULL,
    `creation_date` TIMESTAMP NOT NULL
);
