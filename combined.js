const e1 = require('express');
var app = e1();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./01_dbconnect.js');
const EmpModel = require('./emp_schema.js');

/*
In the postman use the following URL
localhost:5000/reg

{
  "employeeid":500,
  "firstname":"Joe",
  "email":"a@gmail.com",
  "password":"abc",
  "sal":3000
}

*/

dbconnect()

//REG API
app.post('/reg', (req, res) => {
  
  const empobj = new EmpModel({
    empid: req.body.employeeid,
    name: req.body.firstname,
    emailid: req.body.email,
    pass: req.body.password,
    salary: req.body.sal,
  });//CLOSE EmpModel
  
  //INSERT/SAVE THE RECORD/DOCUMENT
  empobj.save()
    .then(inserteddocument => {
      res.status(200).send('DOCUMENT INSERED IN MONGODB DATABASE');
    })//CLOSE THEN
    .catch(err => {
      res.status(500).send({ message: err.message || 'Error in Employee Save ' })
    });//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
);//CLOSE POST METHOD

// Login API using empid and pass
app.post('/login', (req, res) => {
    // Extract empid and pass from the request body
    const { empid, pass } = req.body;

    // Find the user by empid
    EmpModel.findOne({ empid: empid })
        .then(user => {
            // If user is not found, return error
            if (!user) {
                return res.status(404).send({ message: "User not found with empid " + empid });
            }

            // Check if the password matches
            if (user.pass === pass) {
                res.status(200).send({ message: 'Login successful!', user });
            } else {
                res.status(401).send({ message: 'Invalid password!' });
            }
        }) // CLOSE THEN
        .catch(err => {
            res.status(500).send({ message: 'Error during login: ' + err.message });
        }); // CLOSE CATCH
}); // CLOSE POST METHOD

//VIEW ALL API GET
app.get('/view', (req, res) => {
    EmpModel.find()
      .then(getalldocumentsfrommongodb => {
        res.status(200).send(getalldocumentsfrommongodb);
      }) //CLOSE THEN
      .catch(err => {
        res.status(500).send({ message: err.message || 'Error in Fetch Employee ' })
      });//CLOSE CATCH
  });//CLOSE GET

  //Search Emp by empid API GET
app.get('/search/:empid', (req, res) => {
    EmpModel.find({ "empid": parseInt(req.params.empid)})
      .then(getsearchdocument => {
        if (getsearchdocument.length > 0) {
          res.send(getsearchdocument);
        }
        else {
          return res.status(404).send({ message: "Not found with id " + req.params.empid });
        }
      }) //CLOSE THEN
      .catch(err => {
        return res.status(500).send({ message: "DB Problem..Error in Retriving with id " });
      })//CLOSE CATCH
  }//CLOSE CALLBACK FUNCTION BODY
  );//CLOSE GET METHOD

  //Delete API
  app.delete('/del/:empid', (req, res) => {
    EmpModel.findOneAndDelete({ "empid": parseInt(req.params.empid) })
    .then(deleteddocument => {
      if (deleteddocument != null) {
        res.status(200).send('DOCUMENT DELETED successfully!' + deleteddocument);
      }
      else {
        res.status(404).send('INVALID EMP ID ' + req.params.empid);
      }
    }) //CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in Delete with id " + req.params.empid });
    })//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
); //CLOSE Delete METHOD

app.delete('/del/all', async (req, res) => {
  try {
      const result = await EmpModel.deleteMany({});
      if (result.deletedCount > 0) {
          res.status(200).send(`All ${result.deletedCount} documents deleted successfully!`);
      } else {
          res.status(404).send('No documents found to delete.');
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "DB Problem..Error in deleting all documents", error: err });
  }
});

//Update API
app.put('/update/:empid', (req, res) => {
    EmpModel.findOneAndUpdate({ "empid": parseInt(req.params.empid) },
    {
      $set: {
        "pass": req.body.password,
        "salary": req.body.sal
      }
    }, { new: true })
    .then(getupdateddocument => {
      if (getupdateddocument != null)
        res.status(200).send('DOCUMENT UPDATED ' + getupdateddocument);
      else
        res.status(404).send('INVALID EMP ID ' + req.params.empid);
    }) // CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in UPDATE with id " + req.params.empid });
    }) // CLOSE CATCH
  } //CLOSE CALLBACK FUNCTION
  ); //CLOSE PUT METHOD
  
// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5000, () => console.log('EXPRESS Server Started at Port No: 5000'));
