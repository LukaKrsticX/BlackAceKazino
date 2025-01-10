Project Title: Black Ace Kazino

---

Description:
This project is a web application for sports betting, developed using the React framework. The goal is to showcase the process of sports betting through ticket creation based on user input, and to implement functionalities for moderators and administrators. The application is intended for registered users, administrators, and moderators.

---

Key Features:
User Role: Users can view available matches, betting options, ticket history, and track their balance, which updates according to ticket outcomes (win/loss).
Moderator Role: Moderators have access to a dashboard to create new matches and update existing ones.
Admin Role: Administrators have the same functionalities as moderators, with additional capabilities to create, update, modify, or delete users.

---

Technologies Used:
Frontend: JavaScript (JS), React (JSX), HTML, CSS
Backend: SQL for database management
This application demonstrates sports betting functionality, allowing users to place bets and track their progress, with admin and moderator management features.

---

Setup Instructions:
Follow these steps to clone, install dependencies, and run the project locally:

1. Clone the Repository
   First, clone the project repository to your local machine using the following command:

bash
git clone https://github.com/LukaKrsticX/BlackAceKazino.git

2. Navigate to the Project Folder
   After cloning, navigate to the project folder:

bash
cd BlackAceKazino

3. Install Dependencies
   Install the necessary dependencies for both the frontend and backend by running the following command:

bash
npm install

4. Set Up Database
   Ensure you have a SQL database set up for the project. Create a database and import the necessary schema from the project files (e.g., SQL script for table creation located in SQL script folder). Adjust the database connection string in the backend code if needed.

5. Configure Database in code
   Change origin in server.js file, line 16.

6. Start the project

bash
node server. js

bash npm start

7. Access the Application
   Once both servers are running, open your browser and navigate to:

http://yourOriginHere
You should be able to interact with the application.

---

Usage:
Upon landing first click on "Registruj se" button where you can register by providing:
name(example)
email(example@gmail.com)
password(Capital letter, no blanco, min 8 characters)

After that you should be navigated to the login section where you have to enter email adress and password.
Upon logging in, your nav-bar will be loaded with odigrano(betting history) and balance, you will also have a choice of games(currently only sport). Click on it and you will receve a display of 3 cards as sport choices, choose one. You will now have different matches(not real) that you can bet on, however at this point, your balance should be 0. Now you will have to change it by logging in as Admin, click on "Izloguj se" to logout.

Now you can login as admin with these credentials:
Username: admin
Password: Sifra123

Once logged in choose AdminDashboard in a nav-bar. Then choose users. Now you should have a loaded page where you can add, eddit and remove users and moderators, but you can not see other admin accounts. There you can give your new account some balance so you can bet with it. Also in admin dashboard, you have option for utakmice(matches). If you select that option a page will open where you can see and edit all ongoing matches from DB(DataBase). To edit it, simply click on edit and scroll down where you will see and be able to update all info about that match.

Now you can log back on your account, select the sport again and when matches pop up you can click on izbor where you will have these options:
1 the winner will be first team
2 the winner will be second tram
x it will be draw

Select one option for at least one match and enter a betting amount in "ulog" field. After that click on "NapraviTiket" button, on pop up click ok and you will be on a next page where you can see details of your ticket. Details provided are:

1. List of matches you bet on where each item of a list represent teams playing, betted option and multiplier.
2. Total multiplier
3. Possible winning amount

And a button "Nazad na sport" that takes you back to choose a sport when clicked.
After that you can click on "Odigrano" in a navbar, where you will see info of tickets you created.

The last role is moderator. He has same functions as user and a Moderator dashboard. When he clicks Moderator Dashboard, he also has Utakmice option as Administrators.

---

Future improvements:
-Add betting option – Roulette
-Add betting option – Black Jack
-Add more functions for Moderator and Administrator
-Add background aesthetic effects
