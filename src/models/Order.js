import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = Schema({
  ticketCode: { type: String, required: true, index: true }, // kode tiket yang di-print
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  institution: { type: String, },
  entryBy: { type: Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refund'], default: 'pending' },
  paymentAmount: { type: Number },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', OrderSchema);
