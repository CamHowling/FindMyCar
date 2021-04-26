FROM mysql:8.0.24

WORKDIR .

COPY database.sql /tmp

RUN mysqld

RUN mysql -u root -p $MYSQL_ROOT_PASSWORD < /tmp/database.sql

RUN --lower_case_table_names=0

RUN mysqld stop

CMD ["mysqld"]