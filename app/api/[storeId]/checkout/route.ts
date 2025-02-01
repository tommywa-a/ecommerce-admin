import Stripe from 'stripe'
import {NextResponse} from 'next/server'

import {stripe} from '@/lib/stripe'
import prismadb from "@/lib/prismadb"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { items } = await req.json()

  if (!items || items.length === 0) {
    return new NextResponse('Cart items are required', { status: 400 })
  }

  const productIds = items.map((item: any) => item.productId)

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  items.forEach((item: any) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return

    line_items.push({
      quantity: item.quantity,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      }
    })
  })

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: items.map((item: any) => ({
          product: {
            connect: {
              id: item.productId
            }
          },
          quantity: item.quantity
        }))
      }
    }
  })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
    metadata: {
      orderId: order.id
    }
  })

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  })
}