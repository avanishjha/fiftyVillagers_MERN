-- Fix existing absolute URLs to be relative
UPDATE blogs 
SET hero_image = REPLACE(hero_image, 'http://localhost:5000', '')
WHERE hero_image LIKE 'http://localhost:5000%';

UPDATE gallery_images 
SET url = REPLACE(url, 'http://localhost:5000', '')
WHERE url LIKE 'http://localhost:5000%';

UPDATE applications 
SET photo_url = REPLACE(photo_url, 'http://localhost:5000', '')
WHERE photo_url LIKE 'http://localhost:5000%';

UPDATE applications 
SET signature_url = REPLACE(signature_url, 'http://localhost:5000', '')
WHERE signature_url LIKE 'http://localhost:5000%';

UPDATE applications 
SET id_proof_url = REPLACE(id_proof_url, 'http://localhost:5000', '')
WHERE id_proof_url LIKE 'http://localhost:5000%';
