export const Order =  {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
      },
      {
        name: 'address',
        title: 'Address',
        type: 'text',
      },
      {
        name: 'phone',
        title: 'Phone Number',
        type: 'string',
      },
      {
        name: 'paymentMethod',
        title: 'Payment Method',
        type: 'string',
      },
      {
        name: 'items',
        title: 'Items',
        type: 'array',
        of: [{
            type: 'reference',
            to: { type: 'food' }
          }],
      },
      {
        name: 'total',
        title: 'Total Amount',
        type: 'string',
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Confirmed', value: 'confirmed' },
            { title: 'Delivered', value: 'delivered' },
            { title: 'Cancelled', value: 'cancelled' }
          ],
          layout: 'radio',
        },
        initialValue: 'pending'
      }
    ],
  };
  