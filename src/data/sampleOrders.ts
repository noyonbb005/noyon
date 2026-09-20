import { Order } from '../types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-849102',
    customerName: 'Sarah Jenkins',
    phone: '+1 (555) 321-9876',
    address: '742 Evergreen Terrace, Springfield, OR',
    items: [
      {
        productId: 'prod-1',
        productName: 'Wireless Bluetooth Noise Cancelling Earbuds Pro',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        price: 1999,
        quantity: 2,
      },
    ],
    totalPrice: 4297,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending',
    createdAt: 'Today, 09:30 AM',
  },
  {
    id: 'ORD-651892',
    customerName: 'Marcus Vance',
    phone: '+1 (555) 789-2341',
    address: '10880 Wilshire Blvd, Los Angeles, CA',
    items: [
      {
        productId: 'prod-2',
        productName: 'Smart Fitness Tracker Watch with AMOLED Display',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        price: 3450,
        quantity: 1,
      },
    ],
    totalPrice: 3749,
    paymentMethod: 'Online Payment',
    status: 'Processing',
    createdAt: 'Yesterday, 04:15 PM',
  },
  {
    id: 'ORD-519284',
    customerName: 'Emily Watson',
    phone: '+1 (555) 456-1122',
    address: '254 Park Avenue, Suite 12B, New York, NY',
    items: [
      {
        productId: 'prod-3',
        productName: 'Minimalist Canvas Everyday Crossbody Bag',
        productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
        price: 1499,
        quantity: 1,
      },
    ],
    totalPrice: 1798,
    paymentMethod: 'Online Payment',
    status: 'Shipped',
    createdAt: '2 days ago',
  },
  {
    id: 'ORD-402918',
    customerName: 'David Miller',
    phone: '+1 (555) 902-3344',
    address: '1200 Grand Ave, Chicago, IL',
    items: [
      {
        productId: 'prod-4',
        productName: 'Ultralight Breathable Running Shoes',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        price: 3999,
        quantity: 1,
      },
    ],
    totalPrice: 4298,
    paymentMethod: 'Cash on Delivery',
    status: 'Delivered',
    createdAt: '3 days ago',
  },
];
