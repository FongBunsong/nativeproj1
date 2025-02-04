const schema_mongoose = require('mongoose');

const EmployeeSchema = schema_mongoose.Schema(
    {
       empid: {type: Number},
       name: { type: String },
       emailid: { type: String },
       pass: { type: String },
       salary: { type: Number },
    }, 
    {
       timestamps: true
    }
    );

module.exports = schema_mongoose.model('emp_collection', EmployeeSchema);