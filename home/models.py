from django.db import models
from django.urls import reverse
from django.conf import settings
from django.db.models.signals import post_save
from django_countries.fields import CountryField
from phone_field import PhoneField
from cloudinary.models import CloudinaryField


# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.name


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Color(models.Model):
    color = models.CharField(max_length=100)

    def __str__(self):
        return self.color


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    contact_person = models.CharField(
        max_length=50, verbose_name='Contact Person')
    mobile = PhoneField()
    address1 = models.CharField(max_length=100)
    address2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=100, blank=True, null=True)
    country = CountryField(multiple=False)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name_plural = 'Addresses'


class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    card_name = models.CharField(
        max_length=50, verbose_name='Card Name')
    card_type = models.CharField(max_length=10, choices=(
        ('VISA', 'VISA'), ('PAYPAL', 'PAYPAL')))
    card_number = models.PositiveIntegerField()
    expiry_date = models.DateField()
    cvv = models.PositiveIntegerField()

    def __str__(self):
        return self.card_name + ' ' + str(self.card_number)

    class Meta:
        verbose_name_plural = 'Payment'


class Product(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)
    brand = models.ForeignKey(
        Brand, null=True, blank=True, on_delete=models.SET_NULL)
    price = models.FloatField()
    discount_price = models.FloatField(null=True, blank=True)
    featured = models.BooleanField(default=False, verbose_name="Is Featured")
    sale = models.BooleanField(default=False, verbose_name="On Sale")
    slug = models.SlugField(unique=True)
    added = models.DateTimeField(
        auto_now_add=True, auto_now=False, verbose_name="Added On")
    updated = models.DateTimeField(
        auto_now_add=False, auto_now=True, verbose_name="Updated On")
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['name', 'slug']
        ordering = ['-added', ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("core:product", kwargs={"slug": self.slug})

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={"slug": self.slug})

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={"slug": self.slug})


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name='images', on_delete=models.CASCADE)
    # image = models.ImageField(upload_to='products/images/')
    image = CloudinaryField('products/')
    featured = models.BooleanField(
        default=False, verbose_name="Featured Image")
    thumbnail = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    updated = models.DateTimeField(
        auto_now_add=False, auto_now=True, verbose_name="Updated On")

    class Meta:
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return self.product.name


class ProductColor(models.Model):
    product = models.ForeignKey(
        Product, related_name='colors', on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True)
    updated = models.DateTimeField(
        auto_now_add=False, auto_now=True, verbose_name="Updated On")

    class Meta:
        verbose_name_plural = 'Product Colors'

    def __str__(self):
        return self.product.name


class OrderProduct(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.CharField(max_length=30, default="Default")
    quantity = models.IntegerField(default=1)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        return self.product.name + ' >>> Qty: ' + str(self.quantity) + ' | Color: ' + str(self.color) + ' : by ' + str(self.user)

    def get_total_price(self):
        return self.quantity * self.product.price

    def get_discounted_price(self):
        try:
            return self.quantity * self.product.discount_price
        except:
            return 0

    def get_final_price(self):
        if self.product.discount_price:
            return self.get_discounted_price()
        else:
            return self.get_total_price()

    def get_saving(self):
        if self.product.discount_price:
            return '$' + str(self.get_total_price() - self.get_discounted_price())
        else:
            return 'N/A'


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    products = models.ManyToManyField(OrderProduct)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField(auto_now=True)
    ordered = models.BooleanField(default=False)
    address = models.ForeignKey(
        Address, related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    payment = models.ForeignKey(
        Payment, related_name='payment', on_delete=models.SET_NULL, blank=True, null=True)
    delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)

    def __str__(self):
        return 'Order ID: ' + str(self.id) + ' by ' + str(self.user)

    def get_total(self):
        total = 0
        for order_product in self.products.all():
            total += order_product.get_final_price()
        return total

    def get_total_quantity(self):
        total = 0
        for order_product in self.products.all():
            total += order_product.quantity
        return total


class WishProduct(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Favourite Products"

    def __str__(self):
        return self.product.name + ' >>>  by ' + str(self.user)

    def get_total_price(self):
        return self.product.price

    def get_discounted_price(self):
        return self.product.discount_price

    def get_final_price(self):
        if self.product.discount_price:
            return self.get_discounted_price()
        else:
            return self.get_total_price()

    def get_saving(self):
        if self.product.discount_price:
            return '$' + str(self.get_total_price() - self.get_discounted_price())
        else:
            return 'N/A'


class WishList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    products = models.ManyToManyField(WishProduct)

    class Meta:
        verbose_name_plural = "Favourite Products List"

    def __str__(self):
        return 'Wishlist ID: ' + str(self.id) + ' by ' + str(self.user)

    def get_total(self):
        total = 0
        for wish_product in self.products.all():
            total += wish_product.get_final_price()
        return total

    def get_total_quantity(self):
        total = 0
        for wish_product in self.products.all():
            total += 1
        return total


class ContactMessage(models.Model):
    name = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    recieved_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Message from ' + self.email

    class Meta:
        verbose_name_plural = 'Message from Customers'
        ordering = ['-recieved_on']


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
