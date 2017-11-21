DROP TABLE IF EXISTS public.company CASCADE;
DROP TABLE IF EXISTS public.user CASCADE;

CREATE TABLE public.company
(
    id bigserial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    ico text NOT NULL UNIQUE,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now()
)
WITH (
    OIDS=FALSE
);

CREATE TABLE public.user
(
    id bigserial NOT NULL PRIMARY KEY,
    name text,
    surname text,
    email text NOT NULL,
    hash text,
    salt text,
    permissions numeric(1, 0) NOT NULL DEFAULT 1,
    "lastActivityAt" timestamp without time zone,
    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone NOT NULL DEFAULT now()
)
WITH (
    OIDS=FALSE
);

CREATE OR REPLACE FUNCTION updatedTimestampColumn()	RETURNS trigger AS
$$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;	
END;
$$
language plpgsql;

CREATE TRIGGER company_updated_timestamp_column
    BEFORE UPDATE ON public.company
    FOR EACH ROW
    EXECUTE PROCEDURE updatedTimestampColumn();

CREATE TRIGGER user_updated_timestamp_column
    BEFORE UPDATE ON public.user
    FOR EACH ROW
    EXECUTE PROCEDURE updatedTimestampColumn();

INSERT INTO "user" VALUES (DEFAULT, 'Test', 'User', 'john.user@doe.com', null, null, 1, '2017-05-19 07:32:34', '2017-05-18 21:16:09', '2017-05-19 07:31:34');
INSERT INTO "user" VALUES (DEFAULT, 'Test', 'Administrator', 'john.administrator@doe.com', null, null, 2, '2017-05-19 07:32:34', '2017-05-18 21:16:09', '2017-05-19 07:31:34');