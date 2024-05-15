import crypto from 'crypto'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import prismadb from '@/lib/prismadb'

const secret = process.env.PAYSTACK_TEST_SECRET_KEY as string

function verify(eventData: any, signature: string): boolean {
	const hmac = crypto.createHmac('sha512', secret)
	const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex')
	return expectedSignature === signature
}

export async function POST(req: Request, res: Response) {
	const eventData = await req.json()
	const signature = req.headers.get('x-paystack-signature') as string

	if (!verify(eventData, signature)) {
		return new NextResponse(null, { status: 400 })
	}

	if (eventData.event === 'charge.success') {
		const transactionId = eventData.data.id
		// Process the successful transaction to update the inventory
		console.log(`Transaction ${transactionId} was successful`)
	}

	const order = await prismadb.order.update({
		where: {
			id: eventData?.data?.metadata?.orderId,
		},
		data: {
			isPaid: true,
		},
		include: {
			orderItems: true,
		},
	})

	const productIds = order.orderItems.map((orderItem) => orderItem.productId)

	await prismadb.product.updateMany({
		where: {
			id: {
				in: [...productIds],
			},
		},
		data: {
			isArchived: true,
		},
	})

	console.log(`Webhook tested`)
	console.log(`Webhook data`, eventData)

	return new NextResponse(null, { status: 200 })



	// if (event.type === "checkout.session.completed") {
	//   const order = await prismadb.order.update({
	//     where: {
	//       id: session?.metadata?.orderId,
	//     },
	//     data: {
	//       isPaid: true,
	//       address: addressString,
	//       phone: session?.customer_details?.phone || ''
	//     },
	//     include: {
	//       orderItems: true,
	//     }
	//   })

	//   const productIds = order.orderItems.map((orderItem) => orderItem.productId)

	//   await prismadb.product.updateMany({
	//     where: {
	//       id: {
	//         in: [...productIds]
	//       }
	//     },
	//     data: {
	//       isArchived: true
	//     }
	//   })
	// }
}
