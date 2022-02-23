# student-result-management-system
A student result management system for colleges and other institutions, build with nodejs and mongodb

To use program, download nodejs, the files as zip and extract on pc

Open folder and open command prompt in that directory

Then type npm i --save

This will install all dependencies

Now, download, install, and start mongodb database and you're all set to use this system

To use the system, you need to create a .env file in the main directory to include:
1. the PORT number e.g. PORT=5000
2. the EMAIL account e.g EMAIL="example@gmail.com"
3. the email PASSWORD e.g PASSWORD="password"
4. the MONGODB connection string e.g. MONGODB="mongodb://localhost/dbname"

Be reminded that for the email system to work and send mail to the students, you need to enable "less secure apps" on the gmail account that you will be using, as google does not allow less secure apps to log into their accounts.

To enter the grades, remember to first add the institutions programs e.g. BSc. Computer Science, as all courses, and students must be associated to a program

Goodluck
