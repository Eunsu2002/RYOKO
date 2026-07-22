CREATE TABLE users (
  id bigint PRIMARY KEY AUTO_INCREMENT,
  username varchar(255) UNIQUE NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  phone_num varchar(255),
  profile_img varchar(255),
  created_at timestamp DEFAULT now(),
  updated_at timestamp
);

CREATE TABLE place (
  id integer PRIMARY KEY AUTO_INCREMENT,
  p_name varchar(255) NOT NULL,
  body text,
  style int NOT NULL DEFAULT 0 COMMENT '여행 스타일 비트 플래그 : [1=のんびり,2=観光,4=アクティビティ,8=グルメ,16=ショッピング,32=文化体験]',
  category varchar(255) COMMENT '예: 자연, 도시, 해변',
  address varchar(255),
  p_location_lat float,
  p_location_lng float,
  avg_star float DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  operating_hours VARCHAR(200),
  recommended_schedule VARCHAR(200),
  updated_at timestamp
);

CREATE TABLE place_img (
	id integer PRIMARY KEY AUTO_INCREMENT,
    place_id integer NOT NULL,
    img_url varchar(255) NOT NULL,
    sort_order integer DEFAULT 0
);

CREATE TABLE reviews (
  id integer PRIMARY KEY AUTO_INCREMENT,
  place_id integer NOT NULL,
  user_id bigint NOT NULL,
  star double NOT NULL COMMENT '0.5~5.0',
  body text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE plan (
  id integer PRIMARY KEY AUTO_INCREMENT,
  user_id bigint NOT NULL,
  p_name varchar(255),
  place_id integer,
  p_location_lat float,
  p_location_lang float,
  start_date datetime,
  end_date datetime,
  memo text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE picks (
  id integer PRIMARY KEY AUTO_INCREMENT,
  user_id bigint NOT NULL,
  place_id integer NOT NULL
);

CREATE UNIQUE INDEX `picks_index_0` ON `picks` (`user_id`, `place_id`);

ALTER TABLE `place_img` ADD FOREIGN KEY (`place_id`) REFERENCES	`place` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`place_id`) REFERENCES `place` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `plan` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `plan` ADD FOREIGN KEY (`place_id`) REFERENCES `place` (`id`);

ALTER TABLE `picks` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `picks` ADD FOREIGN KEY (`place_id`) REFERENCES `place` (`id`);
