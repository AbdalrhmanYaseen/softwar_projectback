const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    validate: [validator.isEmail, 'Please provide a valid email'] 
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['student','parent','teacher','trainee'], required: true },

  // الحقول الخاصة بالطلاب والمتدربين
  studentType: {
    type: String,
    enum: ['school', 'university'],
    required: function() { return this.role === 'student'; }
  },
  schoolGrade: {
    type: String,
    enum: ['grade1','grade2','grade3','grade4','grade5','grade6','grade7','grade8','grade9','grade10','grade11','grade12'],
    required: function() { return this.role === 'student' && this.studentType === 'school'; }
  },
  universityMajor: {
    type: String,
    enum: ['engineering','medicine','law','business','computer-science','arts','science','education', 'other' , null],
    default: null

  },
  trainingField: {
    type: String,
    enum: ['engineering','legal','languages','it','business','medical','education' , null],
    default: null
  },

  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
