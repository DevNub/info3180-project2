# INFO3180 Project 2
Project 2 (Photogram)




Remember to always create a virtual environment and install the packages in your requirements file

```
$ python3.5 -m venv venv (you may need to use python3 or python3.5 [on Cloud9] instead)
$ source venv/bin/activate (or .\venv\Scripts\activate on Windows)
$ pip install -r requirements.txt 
$ python3.5 run.py



sudo service postgresql start 
sudo sudo -u postgres psql
create user "project2user";
create database "project2"; 
\password project2user                =>(project2)
alter database project2 owner to project2user; 

\q 

python3.5 flask-migrate.py db init
python3.5 flask-migrate.py db migrate
python3.5 flask-migrate.py db upgrade 



heroku login
heroku apps:create                          =>https://nameless-dusk-69580.herokuapp.com/
git push heroku master 

heroku addons:create heroku-postgresql:hobby-dev       =>postgres://czqowwknlaudcp:4575d49d35647513465716a24862b90b87695df2f9177c3a2e840c4214fe110a@ec2-54-227-245-146.compute-1.amazonaws.com:5432/d2gdamnrqepsr3
                                                            =>DB URL: postgresql-curved-59667
heroku config -s 
```
