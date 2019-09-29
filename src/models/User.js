import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, index: true, required: true },
  password: { type: String, required: true, select: false },
  activated: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'organizer', 'partner'] }
});

export default mongoose.model('User', UserSchema);
