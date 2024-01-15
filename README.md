# Northcoders News API

Instructions on how to create the environment variables for anyone who wishes to clone my project and run it locally.

As .env.\* is added to the .gitignore, if you wish to clone my repo you will not have access to the necessary environment variables. Here's how to connect to the databases locally:

1. Development Database:

Create a .env.development file in the root of the project and add the following:
PGDATABASE = nc_news

2. Test Database:

Create a .env.test file in the root of the project and add the following:
PGDATABASE = nc_news_test

Ensure these files are not committed to version control.
