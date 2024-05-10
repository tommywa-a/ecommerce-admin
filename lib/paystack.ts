import { Paystack } from 'paystack-api'

export const paystack = new Paystack(process.env.PAYSTACK_TEST_SECRET_KEY)