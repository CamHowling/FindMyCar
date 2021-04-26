CREATE DATABASE my_schema;
CREATE TABLE my_schema.users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(20) NOT NULL,
    user_password TEXT NOT NULL,
    carlocation TEXT,
    PRIMARY KEY (id)
); 