import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue'; // <--- IMPORT MỚI

// --- Public Views ---
import ProductListView from '@/modules/products/views/ProductListView.vue';
import ProductDetailView from '@/modules/products/views/ProductDetailView.vue';
import CartView from '@/modules/cart/views/CartView.vue';
import CheckoutView from '@/modules/cart/views/CheckoutView.vue';
import PaymentResultView from '@/modules/cart/views/PaymentResultView.vue';
import OrderDetailView from '@/modules/orders/views/OrderDetailView.vue';

// --- User Views ---
import UserProfileView from '@/modules/user/views/UserProfileView.vue';
import OrderHistoryView from '@/modules/orders/views/OrderHistoryView.vue';

// --- Auth Views ---
import LoginView from '@/modules/auth/views/LoginView.vue';
import RegisterView from '@/modules/auth/views/RegisterView.vue';
import ForgotPasswordView from '@/modules/auth/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/modules/auth/views/ResetPasswordView.vue';
import AccountActivationView from '@/modules/auth/views/AccountActivationView.vue';

// --- Admin Views (Dynamic Import) ---
const BrandAdminTable = () => import('@/modules/taxonomy/components/BrandAdminTable.vue');
const CategoryAdminTable = () => import('@/modules/taxonomy/components/CategoryAdminTable.vue');
const ProductAdminTable = () => import('@/modules/products/components/ProductAdminTable.vue');
const ProductForm = () => import('@/modules/products/components/ProductForm.vue');
const AdminOrderTable = () => import('@/modules/orders/components/AdminOrderTable.vue');
const AdminOrderDetailView = () => import('@/modules/orders/views/AdminOrderDetailView.vue');
const VoucherAdminTable = () => import('@/modules/marketing/components/VoucherAdminTable.vue');
const EmployeeAdminTable = () => import('@/modules/hr/components/EmployeeAdminTable.vue');

// --- NEW ADMIN VIEWS ---
const AdminDashboard = () => import('@/modules/admin/views/DashboardView.vue');
const CustomerAdminTable = () => import('@/modules/admin/views/CustomerAdminTable.vue');
const AdminActivityLog = () => import('@/modules/admin/views/AdminActivityLog.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ====================================================
    // 1. PUBLIC & CUSTOMER ROUTES (Dùng MainLayout)
    // ====================================================
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'Home', component: ProductListView },
        { path: 'products', name: 'ProductList', component: ProductListView },
        { path: 'products/:slug', name: 'ProductDetail', component: ProductDetailView },
        
        // Cart & Checkout
        { path: 'cart', name: 'Cart', component: CartView },
        { path: 'checkout', name: 'Checkout', component: CheckoutView, meta: { requiresAuth: true } },
        { path: 'payment-result', name: 'PaymentResult', component: PaymentResultView },
        
        // User Account
        { path: 'profile', name: 'UserProfile', component: UserProfileView, meta: { requiresAuth: true } },
        { path: 'addresses', redirect: { name: 'UserProfile' } }, 
        { path: 'order-history', name: 'OrderHistory', component: OrderHistoryView, meta: { requiresAuth: true } },
        { 
          path: 'order-history/:id', 
          name: 'OrderDetail', 
          component: OrderDetailView, 
          meta: { requiresAuth: true } 
        },
      ]
    },

    // ====================================================
    // 2. AUTH ROUTES (Dùng AuthLayout)
    // ====================================================
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'Login', component: LoginView },
        { path: 'register', name: 'Register', component: RegisterView },
        { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
        { path: 'reset-password', name: 'ResetPassword', component: ResetPasswordView },
        { path: '/activate', name: 'AccountActivation', component: AccountActivationView }, 
      ]
    },

    // ====================================================
    // 3. ADMIN ROUTES (Dùng AdminLayout MỚI)
    // ====================================================
    {
      path: '/admin',
      component: AdminLayout, // <--- THAY ĐỔI Ở ĐÂY
      meta: { requiresAuth: true, roles: ['ROLE_ADMIN', 'ROLE_SALE_MANAGER'] },
      children: [
        // Redirect mặc định vào Dashboard
        { path: '', redirect: { name: 'AdminDashboard' } }, 
        
        // 1. Dashboard
        { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },

        // 2. Quản lý nghiệp vụ
        { path: 'brands', name: 'AdminBrands', component: BrandAdminTable },
        { path: 'categories', name: 'AdminCategories', component: CategoryAdminTable },
        { path: 'products', name: 'AdminProductList', component: ProductAdminTable },
        { path: 'products/:id', name: 'AdminProductForm', component: ProductForm },
        { path: 'orders', name: 'AdminOrderList', component: AdminOrderTable },
        { path: 'orders/:id', name: 'AdminOrderDetail', component: AdminOrderDetailView },
        { path: 'vouchers', name: 'AdminVouchers', component: VoucherAdminTable },
        { path: 'employees', name: 'AdminEmployees', component: EmployeeAdminTable },

        // 3. Module Mới
        { path: 'customers', name: 'AdminCustomers', component: CustomerAdminTable },
        { path: 'logs', name: 'AdminLogs', component: AdminActivityLog },
      ]
    },
    
    // Fallback 404
    { 
      path: '/:pathMatch(.*)*', 
      redirect: '/' 
    }
  ]
});

// --- NAVIGATION GUARDS ---
import { useAuthStore } from '@/modules/auth/store/auth.store';

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // 1. Check Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  // 2. Check Roles
  if (to.meta.roles) {
      const userRoles = authStore.user?.roles || [];
      const hasPermission = to.meta.roles.some(role => userRoles.includes(role));
      
      if (!hasPermission) {
          // Nếu không có quyền admin, đẩy về trang chủ khách hàng
          return next({ name: 'Home' });
      }
  }

  next();
});

export default router;