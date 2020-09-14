from django.contrib import admin
from import_export.admin import ImportExportModelAdmin, ImportExportActionModelAdmin
from .models import (Category, Brand, Color, Product, ProductImage, Address, Payment,
                     ProductColor, OrderProduct, WishProduct, WishList, Order, ContactMessage)

# Register your models here.


class ContactMessageModelAdmin(ImportExportActionModelAdmin):
    list_display = ['email', 'subject']
    list_display_links = ['subject']

    class Meta:
        model = ContactMessage


class CategoryModelAdmin(ImportExportModelAdmin):
    class Meta:
        model = Category


class BrandModelAdmin(ImportExportModelAdmin):
    class Meta:
        model = Brand


class ColorModelAdmin(ImportExportModelAdmin):
    class Meta:
        model = Color


class ProductImagesInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    max_num = 6


class ProductColorsInline(admin.TabularInline):
    model = ProductColor
    extra = 3
    max_num = 6


class ProductModelAdmin(ImportExportModelAdmin, ImportExportActionModelAdmin, admin.ModelAdmin):
    inlines = [ProductImagesInline, ProductColorsInline]
    list_display = ['name', 'price', 'discount_price',
                    'category', 'brand', 'featured', 'sale']
    list_display_links = ['name']
    list_filter = ['category', 'brand', 'featured', 'sale', 'active']
    search_fields = ['name', 'description']
    list_editable = ['price', 'discount_price', 'featured', 'sale']
    readonly_fields = ['added', 'updated']
    prepopulated_fields = {'slug': ('name',)}

    class Meta:
        model = Product


class ProductImageModelAdmin(ImportExportModelAdmin, ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ['product', 'image', 'featured', 'thumbnail']
    list_display_links = ['image']

    class Meta:
        model = ProductImage


class ProductColorModelAdmin(ImportExportModelAdmin, ImportExportActionModelAdmin, admin.ModelAdmin):
    list_display = ['product', 'color']
    list_display_links = ['color']

    class Meta:
        model = ProductColor


class OrderProductModelAdmin(ImportExportModelAdmin):
    list_display = ['__str__', 'quantity', 'ordered']

    class Meta:
        model = OrderProduct


class OrderModelAdmin(ImportExportModelAdmin):
    list_display = ['id', 'user', 'ordered', 'address', 'payment', 'delivered']
    list_display_links = ['user', 'address', 'payment']
    list_editable = ['delivered', ]

    class Meta:
        model = Order


class WishProductModelAdmin(ImportExportModelAdmin):
    list_display = ['__str__', ]

    class Meta:
        model = WishProduct


class WishListModelAdmin(ImportExportModelAdmin):
    list_display = ['__str__', ]

    class Meta:
        model = WishList


class AddressModelAdmin(admin.ModelAdmin):
    list_display = [
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
    ]
    list_filter = ['default', 'country']
    search_fields = ['user', 'contact_person', 'address1',
                     'address2', 'zip_code', 'mobile']

    class Meta:
        model = Address


class PaymentModelAdmin(admin.ModelAdmin):
    list_display = ['user', 'card_name', 'card_number']

    class Meta:
        model = Payment


admin.site.register(Category, CategoryModelAdmin)
admin.site.register(Brand, BrandModelAdmin)
admin.site.register(Color, ColorModelAdmin)
admin.site.register(Product, ProductModelAdmin)
admin.site.register(ProductImage, ProductImageModelAdmin)
admin.site.register(ProductColor, ProductColorModelAdmin)
admin.site.register(OrderProduct, OrderProductModelAdmin)
admin.site.register(Order, OrderModelAdmin)
admin.site.register(WishProduct, WishProductModelAdmin)
admin.site.register(WishList, WishListModelAdmin)
admin.site.register(ContactMessage, ContactMessageModelAdmin)
admin.site.register(Address, AddressModelAdmin)
admin.site.register(Payment, PaymentModelAdmin)
