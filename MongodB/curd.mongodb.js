//CURD operations in MongoDB

use("curdDb");

// //Create
// db.createCollection("users");
// db.users.insertMany([
//   { name: "John", age: 25 },
//   { name: "Jane", age: 22 },
//   { name: "Doe", age: 30 },
//   { name: "Smith", age: 35 },
//   { name: "Doe", age: 40 },
// ]);

// //Read
// let a = db.users.find({ age: 30 });
// console.log(a.toArray());

// //Update
// db.users.updateOne({ age:25 }, { $set: { age: 99 } });//will update only first matching record
// db.users.updateMany({ age:30 }, { $set: { age: 99 } });//will update all matching records

//Delete
db.users.deleteOne({ name: "John" }); //will delete only first matching record
db.users.deleteMany({ age: 99 });//will delete all matching records
