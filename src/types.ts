export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  originalPrice?: number;
  discountPercent: number;
  category: string;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  isFlashDeal?: boolean;
  isTrending?: boolean;
}

export type Category = string;
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  discountText: string;
  tag: string;
  bgColor: string;
  buttonText: string;
  image: string;
  categoryLink?: string;
}

export interface TopCategory {
  id: string;
  name: string;
  iconName: string;
  badge?: string;
  color: string;
}

export type BottomNavTab = 'home' | 'category' | 'message' | 'cart' | 'login';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Inactive';
  joinedDate: string;
  avatar: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  salesTaxPercent: number;
  enableCod: boolean;
  enableOnlinePayment: boolean;
  enableOrderNotifications: boolean;
  enableLowStockAlert: boolean;
  lowStockThreshold: number;
}

export type AdminNavPage =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'edit-product'
  | 'delete-product'
  | 'orders'
  | 'customers'
  | 'settings';
