--Create New Account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--Modify Account
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
--Delete Account
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
--GM Hummer Replace wording
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
--Items that belong to the "Sport" Category
SELECT inv.inv_make,
    inv.inv_model,
    cls.classification_name
FROM public.inventory AS inv
    INNER JOIN public.classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';
-- Modifying image path
UPDATE public.inventory
SET inv_image = CONCAT(
        '/images/vehicles/',
        SUBSTRING(
            inv_image
            FROM POSITION('/' IN inv_image) + 8
        )
    ),
    inv_thumbnail = CONCAT(
        '/images/vehicles/',
        SUBSTRING(
            inv_thumbnail
            FROM POSITION('/' IN inv_thumbnail) + 8
        )
    );