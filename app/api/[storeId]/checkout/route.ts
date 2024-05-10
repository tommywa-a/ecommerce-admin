import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const secretKey: string = process.env.PAYSTACK_TEST_SECRET_KEY as string;
const url: string = process.env.NEXT_PUBLIC_PAYSTACK_PAYMENT_URL as string;

const getCommonHeaders = () => ({
  Authorization: `Bearer ${secretKey}`,
  'Content-Type': 'application/json',
});

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	const { productIds } = await req.json()

	if (!productIds || productIds.length === 0) {
		return new NextResponse('Product IDs are required', { status: 400 })
	}

	const products = await prismadb.product.findMany({
		where: {
			id: {
				in: productIds,
			},
		},
	})

	const line_items: any = []

	products.forEach((product) => {
		line_items.push({
			quantity: 1,
			price_data: {
				currency: 'USD',
				product_data: {
					name: product.name,
				},
				unit_amount: product.price.toNumber() * 100,
			},
		})
	})

	const order = await prismadb.order.create({
		data: {
			storeId: params.storeId,
			isPaid: false,
			orderItems: {
				create: productIds.map((productId: string) => ({
					product: {
						connect: {
							id: productId,
						},
					},
				})),
			},
		},
	})

	const newAmount = line_items.reduce((acc: number, item: { price_data: { unit_amount: number } }) => acc + item.price_data.unit_amount, 0)

	const options = {
    method: 'POST',
    headers: getCommonHeaders(),
    body: JSON.stringify({
      email: "tomiwa95@gmail.com",
      amount: newAmount,
      currency: "NGN",
      callback_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      metadata:{
				orderId: order.id,
			},
    }),
  }

	// const session = await stripe.checkout.sessions.create({
	// 	line_items,
	// 	mode: 'payment',
	// 	billing_address_collection: 'required',
	// 	phone_number_collection: {
	// 		enabled: true,
	// 	},
	// 	success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
	// 	cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
	// 	metadata: {
	// 		orderId: order.id,
	// 	},
	// })

	const response = await fetch(`${url}/transaction/initialize`, options);
    const session = await response.json();

	return NextResponse.json(
		{ url: session.data.authorization_url },
		{
			headers: corsHeaders,
		}
	)
}
