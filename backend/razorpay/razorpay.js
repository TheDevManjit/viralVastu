import razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const createRazorpayInstance = () => {
  return new razorpay({
    key_id: process.env.RP_TEST_KEY,
    key_secret: process.env.RP_LIVE_KEY,
  });
}

export { createRazorpayInstance };

