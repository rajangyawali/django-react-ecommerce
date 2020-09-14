from rest_framework.permissions import AllowAny, IsAuthenticated
from django_countries import countries
from home.models import (Product, Category, ProductImage, Order, OrderProduct, Payment,
                         UserProfile, WishProduct, WishList, Address)
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework import viewsets
from .serializers import (ProductSerializer, ProductImageSerializer, OrderSerializer, PaymentSerializer,
                          WishProductSerializer, WishListSerializer, ContactMessageSerializer,
                          CategorySerializer, AddressSerializer)
from django.shortcuts import get_object_or_404, Http404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


class UserProfileView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'id': request.user.id, 'name': request.user.name, 'email': request.user.email}, status=HTTP_200_OK)


class Categories(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class Products(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductSerializer
    search_fields = ['name', 'category__name', 'brand__name']
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['category__name', 'brand__name']
    queryset = Product.objects.all()


class FeaturedProducts(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(featured=True)


class ProductImage(viewsets.ModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = ProductImageSerializer
    queryset = ProductImage.objects.all()


class OrderQuantityUpdateView(APIView):

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order product is in the order
            if order.products.filter(product__slug=product.slug).exists():
                order_product = OrderProduct.objects.filter(
                    product=product,
                    user=request.user,
                    ordered=False
                )[0]
                if order_product.quantity > 1:
                    order_product.quantity -= 1
                    order_product.save()
                else:
                    order.products.remove(order_product)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This product was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderProductColorUpdateView(APIView):

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        color = request.data.get('color', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order product is in the order
            if order.products.filter(product__slug=product.slug).exists():
                order_product = OrderProduct.objects.filter(
                    product=product,
                    user=request.user,
                    ordered=False
                )[0]
                order_product.color = color
                order_product.save()
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This product was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderproductDeleteView(DestroyAPIView):
    queryset = OrderProduct.objects.all()


class CartClearView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.user)
        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            for product in order.products.all():
                order.products.remove(product)
                product.delete()
            return Response(status=HTTP_200_OK)
        else:
            return Response({"message": "You do not have products in cart"}, status=HTTP_400_BAD_REQUEST)


class AddToCartView(APIView):

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid Request"}, status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, slug=slug)
        order_product, create = OrderProduct.objects.get_or_create(
            product=product, user=request.user, ordered=False)
        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            # Check if the ordered product is in the order
            if order.products.filter(product__slug=product.slug).exists():
                order_product.quantity += 1
                order_product.save()
                return Response(status=HTTP_200_OK)
            else:
                order.products.add(order_product)
                return Response(status=HTTP_200_OK)
        else:
            order = Order.objects.create(user=request.user)
            order.products.add(order_product)
            return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")


class WishproductDeleteView(DestroyAPIView):
    queryset = WishProduct.objects.all()


class WishListClearView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.user)
        wishlist_qs = WishList.objects.filter(user=request.user)
        if wishlist_qs.exists():
            wishlist = wishlist_qs[0]
            for product in wishlist.products.all():
                wishlist.products.remove(product)
                product.delete()
            return Response(status=HTTP_200_OK)
        else:
            return Response({"message": "You do not have products in wishlist"}, status=HTTP_400_BAD_REQUEST)


class AddToWishListView(APIView):

    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid Request"}, status=HTTP_400_BAD_REQUEST)
        product = get_object_or_404(Product, slug=slug)
        wish_product, create = WishProduct.objects.get_or_create(
            product=product, user=request.user)
        wishlist_qs = WishList.objects.filter(user=request.user)
        if wishlist_qs.exists():
            wishlist = wishlist_qs[0]
            # Check if the ordered product is in the order
            if wishlist.products.filter(product__slug=product.slug).exists():
                return Response(status=HTTP_200_OK)
            else:
                wishlist.products.add(wish_product)
                return Response(status=HTTP_200_OK)
        else:
            wishlist = WishList.objects.create(user=request.user)
            wishlist.products.add(wish_product)
            return Response(status=HTTP_200_OK)


class WishListDetailView(RetrieveAPIView):
    serializer_class = WishListSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        try:
            wishlist = WishList.objects.get(user=self.request.user)
            return wishlist
        except ObjectDoesNotExist:
            raise Http404("You do not have an active wishlist")


class ContactMessageView(CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = (AllowAny,)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class AddressUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Address.objects.all()


class PaymentListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PaymentUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()


class PaymentDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Payment.objects.all()


class OrderSuccessView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            userprofile = UserProfile.objects.get(user=self.request.user)
            address = Address.objects.get(user=self.request.user)
            payment = Payment.objects.get(user=self.request.user)
            total_amount = order.get_total()
            total_quantity = order.get_total_quantity()

            order_products = order.products.all()
            order_products.update(ordered=True)
            for product in order_products:
                product.save()

            order.ordered = True
            order.payment = payment
            order.address = address
            order.save()
            order_id = order.id
            return Response({"Order ID": order_id}, status=HTTP_200_OK)
        except:
            return Response({"message": "Order Failed !!"}, status=HTTP_400_BAD_REQUEST)
