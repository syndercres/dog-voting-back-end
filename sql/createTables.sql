CREATE TABLE votes (
  id SERIAL,
  breed VARCHAR(255) PRIMARY KEY,
  votes INTEGER
);


INSERT INTO votes (breed, votes)
VALUES 
  ('Labrador-Retriever', 10),
  ('German-Shepherd', 9),
  ('Golden-Retriever', 8),
  ('French-Bulldog', 7),
  ('Bulldog', 6),
  ('Poodle', 5),
  ('Rottweiler', 4),
  ('Yorkshire-Terrier', 3),
  ('Boxer', 2),
  ('Siberian-Husky', 1),
  ('Dalmatian', 1),
  ('Pomeranian', 1),
  ('Shih-Tzu', 1),
  ('Beagle', 1),
  ('Chihuahua', 1)


  IF EXISTS (SELECT breed FROM votes WHERE breed = 'dog') THEN
  UPDATE votes
  SET votes = votes + 1
  WHERE breed = 'dog';
ELSE
  INSERT INTO votes (breed, votes)
  VALUES ('dog', 1);
END IF;