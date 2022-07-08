/*
Queries used to update postgres
with domain mapping given in exercise.
*/

CREATE TABLE domainMapping(
    question_id VARCHAR NOT NULL,
    domain VARCHAR NOT NULL
);

INSERT INTO
    domainMapping (question_id, domain)
VALUES
    ('question_a','depression'),
    ('question_b','depression'),
    ('question_c','mania'),
    ('question_d','mania'),
    ('question_e','anxiety'),
    ('question_f','anxiety'),
    ('question_g','anxiety'),
    ('question_h','substance_use');