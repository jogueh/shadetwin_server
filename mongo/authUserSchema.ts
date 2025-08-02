// schema defines the data our node should contain
import {model, Schema, Document} from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = 'user' | 'shadetwin' | 'admin';
// extending Document includes all built-in Mongoose document methods & properties in custom User type
// Declares a custom instance method: comparePassword.
// Enables strong typing wherever you use the User model.
export interface User extends Document {
    _id: string; // MongoDB document id
    firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  dob?: Date | undefined;
  role: UserRole;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema with type User
const UserSchema: Schema<User> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date, required: false }, // optional field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'shadetwin', 'admin'], 
    default: 'user', 
    required: true 
  },
});

// code that runs before saving a user to the database
// this function hashes the password before saving it
UserSchema.pre<User>('save', async function (this: User, next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// verify the password entered by the user (ex. login)
// this function compares the candidate password with the hashed password in the database
UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// creates a collection named users
export default model<User>('authUsers', UserSchema);
