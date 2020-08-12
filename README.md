# whitebox code challenge

You need to have docker and docker compose installed and running. You must also
provide the data.sql file uncompressed. It must also provide the necessary SQL
create table statement e.g.,

```sql
CREATE TABLE `rates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) unsigned NOT NULL,
  `start_weight` decimal(10,2) DEFAULT NULL,
  `end_weight` decimal(10,2) DEFAULT NULL,
  `zone` varchar(1) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `shipping_speed` varchar(15) DEFAULT NULL,
  `locale` enum('international','domestic') DEFAULT NULL,
  PRIMARY KEY (`id`)
)
```

There's a run script which will run both the docker build and docker up commands
and then you can find the resulting spreadsheet in the `output` directory.

## tl;dr

1. `gunzip` the provided `data.sql.gz` into the `sql` directory.
2. Run `run.bash` script. (Alternatively, run `docker-compose build` and
   `docker-compose up --abort-on-container-exit`)
3. Resulting excel spreadsheet is in `output` directory.

## notes

- with only several thousand rows this isn't important, but an index on
  `client_id` would improve performance
- the provided sample output spreadsheep uses strings everywhere, but all the
  fields are numbers, so we could use some excel processing afterwards if we
  entered the data into the spreadsheet as numbers (or we just leave all the
  processing to SQL...)
- it would be nice to split the huge index.js into some smaller functions and
  files, write tests, add lint, etc
- i would have liked to use sqlite for this task instead of spinning up mysql,
  but the provided schema uses some mysql-only stuff (e.g. `unsigned`) so we
  stuck with mysql (actually using mariadb in docker compose)
- i only tested this on my macbook, but it's docker so in theory it works the
  same everywhere that docker runs
