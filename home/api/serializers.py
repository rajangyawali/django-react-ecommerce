from home.models import (Product, ProductImage, ProductColor, OrderProduct, Address, Payment,
                         Order, Category, Brand, Color, UserProfile, WishProduct, WishList, ContactMessage)
from django_countries.serializer_fields import CountryField
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


class ProductColorSerializer(serializers.ModelSerializer):
    color = serializers.SlugRelatedField(
        queryset=Color.objects.all(), slug_field='color')

    class Meta:
        model = ProductColor
        fields = ['color', ]


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(), slug_field='name')
    brand = serializers.SlugRelatedField(
        queryset=Brand.objects.all(), slug_field='name')
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'brand', 'price', 'discount_price',
                  'featured', 'sale', 'slug', 'added', 'updated', 'active', 'images', 'colors']


class OrderProductSerializer(serializers.ModelSerializer):

    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    saving = serializers.SerializerMethodField()

    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'quantity', 'color',
                  'total_price', 'discounted_price', 'final_price', 'saving']

    def get_product(self, obj):
        return ProductSerializer(obj.product).data

    def get_total_price(self, obj):
        return obj.get_total_price()

    def get_discounted_price(self, obj):
        return obj.get_discounted_price()

    def get_final_price(self, obj):
        return obj.get_final_price()

    def get_saving(self, obj):
        return obj.get_saving()


class OrderSerializer(serializers.ModelSerializer):
    order_products = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_products', 'total', 'total_quantity']

    def get_order_products(self, obj):
        return OrderProductSerializer(obj.products.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total()

    def get_total_quantity(self, obj):
        return obj.get_total_quantity()


class WishProductSerializer(serializers.ModelSerializer):

    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()
    saving = serializers.SerializerMethodField()

    class Meta:
        model = WishProduct
        fields = ['id', 'product', 'total_price', 'discounted_price',
                  'final_price', 'saving']

    def get_product(self, obj):
        return ProductSerializer(obj.product).data

    def get_total_price(self, obj):
        return obj.get_total_price()

    def get_discounted_price(self, obj):
        return obj.get_discounted_price()

    def get_final_price(self, obj):
        return obj.get_final_price()

    def get_saving(self, obj):
        return obj.get_saving()


class WishListSerializer(serializers.ModelSerializer):
    wish_products = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()

    class Meta:
        model = WishList
        fields = ['wish_products', 'total', 'total_quantity']

    def get_wish_products(self, obj):
        return WishProductSerializer(obj.products.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total()

    def get_total_quantity(self, obj):
        return obj.get_total_quantity()


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Address
        fields = (
            'id',
            'user',
            'contact_person',
            'mobile',
            'address1',
            'address2',
            'city',
            'state',
            'zip_code',
            'country',
            'default'
        )


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id',
            'user',
            'card_name',
            'card_number',
            'card_type',
            'expiry_date',
            'cvv',
        )
