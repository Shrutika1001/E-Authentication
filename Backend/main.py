from fastapi import FastAPI
from pydantic import BaseModel
import smtplib
import random
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
class LoginUser(BaseModel):
    email: str
    password: str

class RegisterUser(BaseModel):
    name: str
    email: str
    password: str

class Code(BaseModel):
    code: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

f = open("passwords.txt", "r")
lines = f.readlines()

@app.get("/")
def start():
    return "Server Started"

@app.post("/login")
def login(data: LoginUser):
    code = random.randint(1000,9999)
    email = data.email;
    password = data.password;

    mydb = mysql.connector.connect(
        host="localhost",
        user=lines[2].replace("muser", ""),
        password=lines[3].replace("mpass", ""),
        database="testdb"
    )
    mycursor = mydb.cursor()

    # Authenticate

    q = "select count(email) from test where email = '" + email + "';"
    mycursor.execute(q)
    result = mycursor.fetchone()
    # mydb.commit()

    print(result[0])

    if result[0] > 0:
        q1 = "select pass from test where email = '" + email + "';"
        mycursor.execute(q1);
        p = mycursor.fetchone()[0]
        if p == password:
            print('Logged in successfully')
            return {"status": 200, "msg": "Logged In Successfully"}
        else:
            return {"status": 500, "msg": "Password Entered is Incorrect"}
    else:
        print('User does not Exists inside the Database')
        return {"status": 404, "msg": "User not exists, Please Register"}

@app.post("/register")
def register(data: RegisterUser):
    code = random.randint(1000,9999)
    mydb = mysql.connector.connect(
        host="localhost",
        user=lines[2].replace("muser", ""),
        password=lines[3].replace("mpass", ""),
        database="testdb"
    )
    mycursor = mydb.cursor()

    # Authenticate

    q = "select count(email) from test where email = '" + data.email + "';"
    mycursor.execute(q)
    result = mycursor.fetchone()
    # mydb.commit()

    print(result[0])

    if result[0] > 0:
        print('User already Exists inside the Database')
        return {"status": 500, "msg": "User Already Exists"}

    # store data in db

    sql = "INSERT INTO test (name, email, pass) VALUES (%s, %s, %s)"
    val = (data.name, data.email, data.password)
    mycursor.execute(sql, val)
    mydb.commit()

    #mail
    email = lines[0].replace("email=", "")
    password = lines[1].replace("pass=", "")

    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()

    s.login(email, password)

    message = "Thanks for using EAuth System\nYour Register Code is : " + str(code)

    s.sendmail(email, data.email, message)
    s.quit()

    return {"status": 200, "code": code}

@app.post("/confirm/{usercode}")
def confirm(usercode: str, data: Code):
    code = data.code
    if usercode == code:
        return {"status": 200, "msg": "Registered User Successfully"}
    else:
        return {"status": 404, "msg": "Entered Code is Incorrect"}
