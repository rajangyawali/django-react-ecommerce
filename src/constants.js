export const endPoint = `https://gyawali-ecommerce.herokuapp.com/api`;
export const loginUrl = `${endPoint}/token/`;
export const signupUrl = `${endPoint}/accounts/signup/`;
export const userIDUrl = `${endPoint}/user-id`;
export const productListUrl = `${endPoint}/products/`;
export const productDetailUrl = (id) => `${endPoint}/products/${id}/`;
export const addToCartUrl = `${endPoint}/add-to-cart/`;
export const orderSummaryUrl = `${endPoint}/order-summary`;
export const orderProductDeleteUrl = (id) =>
  `${endPoint}/order-products/${id}/delete/`;
export const orderProductUpdateQuantityUrl = `${endPoint}/order-product/update-quantity/`;
export const orderProductColorUpdateUrl = `${endPoint}/order-product/update-product-color/`;
export const clearCartUrl = `${endPoint}/clear-cart/`;
export const addToWishlistUrl = `${endPoint}/add-to-wishlist/`;
export const clearWishlistUrl = `${endPoint}/clear-wishlist/`;
export const wishlistSummaryUrl = `${endPoint}/wishlist-summary`;
export const wishProductDeleteUrl = (id) =>
  `${endPoint}/wish-products/${id}/delete/`;
export const contactMessageUrl = `${endPoint}/contact-message/`;
export const categoriesUrl = `${endPoint}/categories`;
export const featuredProductsUrl = `${endPoint}/featured-products/`;
export const countriesUrl = `${endPoint}/countries/`;
export const addressUrl = `${endPoint}/address`;
export const addressCreateUrl = `${endPoint}/address/create/`;
export const addressUpdateUrl = (id) => `${endPoint}/address/${id}/update/`;
export const addressDeleteUrl = (id) => `${endPoint}/address/${id}/delete/`;
export const paymentUrl = `${endPoint}/payment`;
export const paymentCreateUrl = `${endPoint}/payment/create/`;
export const paymentUpdateUrl = (id) => `${endPoint}/payment/${id}/update/`;
export const paymentDeleteUrl = (id) => `${endPoint}/payment/${id}/delete/`;
export const orderSuccessUrl = `${endPoint}/order-success/`;