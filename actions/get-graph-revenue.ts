import prismadb from "@/lib/prismadb"

interface GraphData {
  name: string
  total: number
}

// Retrieves the total revenue per month for a given store from the database and formats it for graphing.
export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  // Get all paid orders for the store
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  // Object to hold the total revenue per month
  const monthlyRevenue: { [key: number]: number } = {}

  // Calculate the revenue for each order and accumulate it by month
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth() // Extract the month from the order's creation date
    let revenueForOrder = 0 // Initialize revenue for the order

    // Sum the price of each item in the order
    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber()
    }

    // Add the revenue of the current order to the total for the month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }

  // Initialize the graph data array with total revenue set to 0 for each month
  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ]

  // Update the graph data with the accumulated revenue for each month
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData // Return the formatted graph data
}
