// Required dependencies
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// Initialize Express app
const app = express();
const port = 81; 
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration to allow requests from localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 1800,
  optionSuccessStatus: 200
}));

// Database connection configuration
const dbConfig = {
  driver: "msnodesqlv8",
  server: 'localhost',
  database: 'BlackAceKazino',
  port: 1433,
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: true
  }
};

// Test SQL Server connection
sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('SQL Server connection error:', err);
    return;
  }
  console.log('SQL Server Connected...');
});

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const query = `INSERT INTO Korisnici (UserName, Email, Password) VALUES (@name, @email, @password)`;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(query);

    return res.status(200).json({ message: 'User registered successfully', data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error registering user' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const query = 'SELECT * FROM Korisnici WHERE Email = @email';
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(query);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      const failedAttempts = user.FailedAttempts + 1;
      if (failedAttempts >= 3) {
        const lockoutTime = new Date(Date.now() + 30 * 60000);  // Lock user for 30 minutes
        await pool.request()
          .input('FailedAttempts', sql.Int, 3)
          .input('LockoutTime', sql.DateTime, lockoutTime)
          .input('Email', sql.NVarChar, email)
          .query(`UPDATE Korisnici SET FailedAttempts = @FailedAttempts, LockoutTime = @LockoutTime WHERE Email = @Email`);

        return res.status(403).json({ error: 'Account locked for 30 minutes due to multiple failed login attempts.' });
      } else {
        await pool.request()
          .input('FailedAttempts', sql.Int, failedAttempts)
          .input('Email', sql.NVarChar, email)
          .query(`UPDATE Korisnici SET FailedAttempts = @FailedAttempts WHERE Email = @Email`);

        return res.status(401).json({ error: `Invalid email or password. ${3 - failedAttempts} attempts remaining.` });
      }
    }

    // Reset failed login attempts after successful login
    await pool.request()
      .input('FailedAttempts', sql.Int, 0)
      .input('LockoutTime', sql.DateTime, null)
      .input('Email', sql.NVarChar, email)
      .query(`UPDATE Korisnici SET FailedAttempts = @FailedAttempts, LockoutTime = @LockoutTime WHERE Email = @Email`);

    return res.status(200).json({ message: 'Login successful', user: { userName: user.UserName, email: user.Email, isAdmin: user.Admin, isModerator: user.Moderator, balance: user.Balance } });
  } catch (err) {
    console.error('Error logging in user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

 // Route to get user balance
app.get('/getBalance', async (req, res) => {
  const { email } = req.query;
  const query = 'SELECT Balance FROM Korisnici WHERE Email = @Email';

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query(query);

    const balance = result.recordset[0]?.Balance;

    if (balance === undefined) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ balance });
  } catch (err) {
    console.error('Error fetching balance:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update user balance
app.post('/updateBalance', async (req, res) => {
  const { email, newBalance } = req.body;

  try {
    // Fetch current balance from the database
    const pool = await sql.connect(dbConfig);
    const fetchQuery = 'SELECT Balance FROM Korisnici WHERE Email = @Email';
    const fetchResult = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query(fetchQuery);

    if (!fetchResult.recordset || fetchResult.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentBalance = fetchResult.recordset[0].Balance;

    // Update the user's balance
    const updateQuery = `
      UPDATE Korisnici
      SET Balance = @NewBalance
      WHERE Email = @Email
    `;
    await pool.request()
      .input('Email', sql.NVarChar, email)
      .input('NewBalance', sql.Decimal(10, 2), newBalance)
      .query(updateQuery);

    console.log(`Balance updated successfully for ${email}. New balance: ${newBalance}`);
    return res.json({ message: 'Balance updated successfully', currentBalance, newBalance });
  } catch (err) {
    console.error('Error updating balance:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch distinct sports from matches
app.get('/sports', async (req, res) => {
  const query = 'SELECT DISTINCT Sport FROM Utakmice';

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);

    const sports = result.recordset.map(record => record.Sport);
    return res.status(200).json(sports);
  } catch (err) {
    console.error('Error fetching sports data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch matches for a given sport with null outcome
app.get('/matches', async (req, res) => {
  const { sport } = req.query;
  const query = `SELECT * FROM Utakmice WHERE Sport = @sport AND IshodID IS NULL`;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('sport', sql.NVarChar, sport)
      .query(query);

    // Convert image blob to base64 URL
    const matchesWithImages = result.recordset.map(match => ({
      ...match,
      imageUrl: match.Image ? `data:image/jpeg;base64,${match.Image.toString('base64')}` : null
    }));

    return res.status(200).json(matchesWithImages);
  } catch (err) {
    console.error('Error fetching matches:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

 // Route to fetch all outcomes (Ishodi)
app.get('/ishodi', async (req, res) => {
  const query = 'SELECT * FROM Ishodi';

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);

    const ishodi = result.recordset.map(record => ({
      IshodID: record.IshodID,
      Ishod: record.Ishod,
      Kvota: record.Kvota
    }));

    return res.status(200).json(ishodi);
  } catch (err) {
    console.error('Error fetching Ishodi data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch user balance
app.get('/korisnici/balance', async (req, res) => {
  const { email } = req.query;
  const query = 'SELECT Balance FROM Korisnici WHERE Email = @Email';

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query(query);

    const balance = result.recordset[0]?.Balance;

    if (balance === undefined) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ balance });
  } catch (err) {
    console.error('Error fetching balance:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new ticket with matches
app.post('/ticket', async (req, res) => {
  const { email, ulog, moguciDobitak, matches } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert ticket data into Tiketi table and get ticket ID
      const ticketInsertQuery = `
        INSERT INTO Tiketi (Email, Ulog, MogucDobitak)
        VALUES (@email, @ulog, @moguciDobitak);
        SELECT SCOPE_IDENTITY() AS TicketId;
      `;
      const ticketInsertResult = await transaction.request()
        .input('email', sql.NVarChar, email)
        .input('ulog', sql.Decimal(10, 2), ulog)
        .input('moguciDobitak', sql.Decimal(10, 2), moguciDobitak)
        .query(ticketInsertQuery);

      const ticketId = ticketInsertResult.recordset[0].TicketId;

      // Insert each match into StavkeTiketa
      const stavkeTiketaInsertQuery = `
        INSERT INTO StavkeTiketa (UtakmicaID, Ishod, Kvota, TiketID, Prosao)
        VALUES (@utakmicaId, 
                CASE WHEN @ishod IS NULL THEN 3 ELSE @ishod END, 
                @kvota, 
                @ticketId, 
                NULL);
      `;

      for (const match of matches) {
        await transaction.request()
          .input('utakmicaId', sql.Int, match.UtakmicaID)
          .input('ishod', sql.Float, match.Ishod)
          .input('kvota', sql.Float, match.Kvota)
          .input('ticketId', sql.Int, ticketId)
          .query(stavkeTiketaInsertQuery);
      }

      await transaction.commit();
      res.status(200).json({ ticketId });
    } catch (error) {
      await transaction.rollback();
      console.error('Error in transaction:', error.message);
      res.status(500).json({ error: 'Error creating ticket' });
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all users except admins
app.get('/get/users', async (req, res) => {
  const query = 'SELECT * FROM Korisnici WHERE Admin = 0';

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);
    const users = result.recordset;
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a user by email
app.delete('/remove/users/:email', async (req, res) => {
  const userEmail = req.params.email;
  const query = 'DELETE FROM Korisnici WHERE Email = @userEmail';

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('userEmail', sql.NVarChar, userEmail)
      .query(query);
    res.status(200).send('User deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint for fetching all matches where the outcome (IshodID) is NULL (admin view)
app.get('/get/utakmice', async (req, res) => {
  const query = `
    SELECT UtakmicaID, datumVreme, Ucesnik1, Ucesnik2, IshodID, Sport
    FROM Utakmice
    WHERE IshodID IS NULL
  `;

  try {
    // Connect to the database and execute the query
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(query);
    const utakmice = result.recordset;
    res.json(utakmice); // Send the list of matches with null outcomes
  } catch (error) {
    console.error('Error fetching utakmice:', error);
    res.status(500).json({ error: 'Internal server error' }); // Error handling
  }
});

// Endpoint for updating the details of a match (admin functionality)
app.put('/update/utakmica/:id', async (req, res) => {
  const { id } = req.params; // Extract match ID from the URL parameter
  const { datumVreme, Ucesnik1, Ucesnik2, IshodID, Sport } = req.body; // Extract updated match data from request body

  // SQL query to update the match details
  const updateQuery = `
    UPDATE Utakmice
    SET datumVreme = @datumVreme,
        Ucesnik1 = @Ucesnik1,
        Ucesnik2 = @Ucesnik2,
        IshodID = @IshodID,
        Sport = @Sport
    WHERE UtakmicaID = @id
  `;

  try {
    // Connect to the database and execute the update query
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('datumVreme', sql.DateTime, datumVreme)
      .input('Ucesnik1', sql.NVarChar, Ucesnik1)
      .input('Ucesnik2', sql.NVarChar, Ucesnik2)
      .input('IshodID', sql.Int, IshodID)
      .input('Sport', sql.NVarChar, Sport)
      .query(updateQuery);

    console.log(`Utakmica updated successfully with ID ${id}`);

    // SQL query to update StavkeTiketa based on the new match outcome (IshodID)
    const updateStavkeQuery = `
      UPDATE StavkeTiketa
      SET Prosao = CASE
                      WHEN Ishod = (SELECT IshodID FROM Utakmice WHERE UtakmicaID = @id) THEN 1
                      WHEN Ishod != (SELECT IshodID FROM Utakmice WHERE UtakmicaID = @id) THEN 0
                      ELSE NULL
                    END
      WHERE UtakmicaID = @id
    `;
    await pool.request()
      .input('id', sql.Int, id)
      .query(updateStavkeQuery);

    // SQL query to check for all tickets related to the updated match
    const checkTicketsQuery = `
      SELECT TiketID 
      FROM StavkeTiketa
      WHERE UtakmicaID = @id
    `;
    const checkTicketsResult = await pool.request()
      .input('id', sql.Int, id)
      .query(checkTicketsQuery);

    // Iterate through each ticket to determine the final status
    for (const ticket of checkTicketsResult.recordset) {
      const ticketId = ticket.TiketID;

      // SQL query to check the status of each ticket (whether it passed or failed)
      const checkStavkeQuery = `
        SELECT COUNT(*) AS TotalCount,
               SUM(CASE WHEN Prosao = 1 THEN 1 ELSE 0 END) AS PassedCount,
               SUM(CASE WHEN Prosao IS NULL THEN 1 ELSE 0 END) AS NullCount
        FROM StavkeTiketa
        WHERE TiketID = @ticketId
      `;
      const checkStavkeResult = await pool.request()
        .input('ticketId', sql.Int, ticketId)
        .query(checkStavkeQuery);

      const { TotalCount, PassedCount, NullCount } = checkStavkeResult.recordset[0];

      let ticketStatus;
      // Determine the ticket status based on the StavkeTiketa results
      if (NullCount > 0) {
        ticketStatus = null; // If there are still null values, ticket status remains null
      } else if (PassedCount === TotalCount) {
        ticketStatus = 1; // If all StavkeTiketa passed, the ticket is successful
      } else {
        ticketStatus = 0; // If any StavkeTiketa failed, the ticket is unsuccessful
      }

      // SQL query to update the ticket status
      const updateTicketQuery = `
        UPDATE Tiketi
        SET Prosao = @ticketStatus
        WHERE TiketID = @ticketId
      `;
      await pool.request()
        .input('ticketStatus', sql.Bit, ticketStatus)
        .input('ticketId', sql.Int, ticketId)
        .query(updateTicketQuery);

      // If the ticket passed, update the user's balance based on the potential winnings
      if (ticketStatus === 1) {
        const getTicketQuery = 'SELECT Email, Ulog FROM Tiketi WHERE TiketID = @ticketId';
        const ticketDetails = await pool.request()
          .input('ticketId', sql.Int, ticketId)
          .query(getTicketQuery);

        const { Email, Ulog } = ticketDetails.recordset[0];

        const getUserBalanceQuery = 'SELECT Balance FROM Korisnici WHERE Email = @Email';
        const userBalanceResult = await pool.request()
          .input('Email', sql.NVarChar, Email)
          .query(getUserBalanceQuery);

        const currentBalance = userBalanceResult.recordset[0]?.Balance || 0;
        const getMogucDobitakQuery = 'SELECT MogucDobitak FROM Tiketi WHERE TiketID = @ticketId';
        const mogucDobitakResult = await pool.request()
          .input('ticketId', sql.Int, ticketId)
          .query(getMogucDobitakQuery);

        const mogucDobitak = mogucDobitakResult.recordset[0]?.MogucDobitak || 0;
        const newBalance = currentBalance + mogucDobitak;

        // SQL query to update the user's balance
        const updateUserBalanceQuery = `
          UPDATE Korisnici
          SET Balance = @NewBalance
          WHERE Email = @Email
        `;
        await pool.request()
          .input('NewBalance', sql.Decimal(10, 2), newBalance)
          .input('Email', sql.NVarChar, Email)
          .query(updateUserBalanceQuery);
      }
    }

    res.status(200).json({ message: 'Utakmica and tickets updated successfully' });
  } catch (error) {
    console.error(`Error updating utakmica with ID ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' }); // Error handling
  }
});

 // Endpoint for fetching tickets associated with a specific user (based on email)
app.get('/tickets/:email', async (req, res) => {
  const { email } = req.params; // Extract email from the URL parameter
  try {
    // Connect to the database and fetch tickets for the specified email
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('Email', sql.NVarChar, email)
      .query('SELECT * FROM Tiketi WHERE Email = @Email');
    
    // Map the results and replace 'null' values in the 'Prosao' field with 'Nepoznat'
    const tickets = result.recordset.map(ticket => ({
      ...ticket,
      Prosao: ticket.Prosao == null ? 'Nepoznat' : ticket.Prosao
    }));
    
    // Return the list of tickets in the response
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal server error' }); // Error handling
  }
});

// Endpoint for creating a new user (with hashed password using bcrypt)
app.post('/create/user', async (req, res) => {
  const { UserName, Email, Password, Admin, Moderator, Balance } = req.body; // Extract data from request body

  try {
    const pool = await sql.connect(dbConfig);

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(Password, 10); 

    // SQL query to insert a new user into the database
    const query = `
      INSERT INTO Korisnici (UserName, Email, Password, Admin, Moderator, Balance)
      VALUES (@UserName, @Email, @Password, @Admin, @Moderator, @Balance)
    `;

    // Execute the query to create the user
    await pool.request()
      .input('UserName', sql.NVarChar, UserName)
      .input('Email', sql.NVarChar, Email)
      .input('Password', sql.NVarChar, hashedPassword)
      .input('Admin', sql.Bit, Admin)
      .input('Moderator', sql.Bit, Moderator)
      .input('Balance', sql.Float, Balance)
      .query(query);

    res.status(200).json({ message: 'User created successfully' }); // Success response
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' }); // Error handling
  }
});

// Endpoint for updating an existing user's information
app.put('/update/user/:email', async (req, res) => {
  const userEmail = req.params.email; // Extract email from the URL parameter
  const { UserName, Password, Balance, Moderator } = req.body; // Extract data from the request body

  // SQL query to update the user's details in the database
  const updateQuery = `UPDATE Korisnici SET UserName = @UserName, Password = @Password, Balance = @Balance, Moderator = @Moderator WHERE Email = @Email`;

  try {
    const pool = await sql.connect(dbConfig);
    // Execute the query to update the user's details
    await pool.request()
      .input('Email', sql.NVarChar, userEmail)
      .input('UserName', sql.NVarChar, UserName)
      .input('Password', sql.NVarChar, Password)
      .input('Balance', sql.Float, Balance)
      .input('Moderator', sql.Bit, Moderator)
      .query(updateQuery);

    console.log(`User updated successfully with Email ${userEmail}`);
    res.status(200).json({ message: 'User updated successfully' }); // Success response
  } catch (error) {
    console.error(`Error updating user with Email ${userEmail}:`, error);
    res.status(500).json({ error: 'Internal server error' }); // Error handling
  }
});

// Endpoint for creating a new match (utakmica)
app.post('/create/utakmica', async (req, res) => {
  const { datumVreme, Ucesnik1, Ucesnik2, Sport, IshodID } = req.body; // Extract match data from request body

  // Validate required fields
  if (!datumVreme || !Ucesnik1 || !Ucesnik2 || !Sport) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  const ishodValue = IshodID ? IshodID : null; // Set IshodID to null if not provided

  // SQL query to insert a new match into the database
  const sqlInsert = `
    INSERT INTO Utakmice (datumVreme, Ucesnik1, Ucesnik2, Sport, IshodID)
    VALUES (@datumVreme, @Ucesnik1, @Ucesnik2, @Sport, @IshodID)
  `;

  try {
    const pool = await sql.connect(dbConfig);
    // Execute the query to create the match
    await pool.request()
      .input('datumVreme', sql.DateTime, datumVreme)
      .input('Ucesnik1', sql.NVarChar, Ucesnik1)
      .input('Ucesnik2', sql.NVarChar, Ucesnik2)
      .input('Sport', sql.NVarChar, Sport)
      .input('IshodID', sql.Int, ishodValue)
      .query(sqlInsert);

    res.status(200).json({ message: 'Utakmica created successfully' }); // Success response
  } catch (err) {
    console.error('Error creating utakmica:', err);
    res.status(500).json({ error: 'Database error' }); // Error handling
  }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log when the server is up and running
});
