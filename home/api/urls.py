from django.urls import path, re_path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("products", views.Products)
router.register("images", views.ProductImage)
router.register("featured-products", views.FeaturedProducts)

urlpatterns = [
    path('', include(router.urls)),
    path('user-id', views.UserProfileView.as_view(), name='user-id'),
    path('countries/', views.CountryListView.as_view(), name='country-list'),
    path('address', views.AddressListView.as_view(), name='address-list'),
    path('address/create/', views.AddressCreateView.as_view(),
         name='address-create'),
    path('address/<pk>/update/',
         views.AddressUpdateView.as_view(), name='address-update'),
    path('address/<pk>/delete/',
         views.AddressDeleteView.as_view(), name='address-delete'),
    path('payment', views.PaymentListView.as_view(), name='payment-list'),
    path('payment/create/', views.PaymentCreateView.as_view(),
         name='payment-create'),
    path('payment/<pk>/update/',
         views.PaymentUpdateView.as_view(), name='payment-update'),
    path('payment/<pk>/delete/',
         views.PaymentDeleteView.as_view(), name='payment-delete'),
    path('add-to-cart/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('order-product/update-product-color/', views.OrderProductColorUpdateView.as_view(),
         name='update-product-color'),
    path('order-summary', views.OrderDetailView.as_view(), name='order-summary'),
    path('order-products/<pk>/delete/',
         views.OrderproductDeleteView.as_view(), name='order-product-delete'),
    path('order-product/update-quantity/', views.OrderQuantityUpdateView.as_view(),
         name='order-product-update-quantity'),
    path('clear-cart/', views.CartClearView.as_view(), name='clear-cart'),
    path('add-to-wishlist/', views.AddToWishListView.as_view(),
         name='add-to-wishlist'),
    path('wish-products/<pk>/delete/',
         views.WishproductDeleteView.as_view(), name='wish-product-delete'),
    path('wishlist-summary', views.WishListDetailView.as_view(),
         name='wishlist-summary'),
    path('clear-wishlist/', views.WishListClearView.as_view(), name='clear-wishlist'),
    path('contact-message/', views.ContactMessageView.as_view(),
         name='contact-message'),
    path('categories', views.Categories.as_view(), name='categories'),
    path('order-success/', views.OrderSuccessView.as_view(), name='order-success')

]
