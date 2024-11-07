const routes = {
    '/api/productos': './api/routes/products/db_productos.cjs',
    '/api/rubros': './api/routes/products/db_rubros.cjs',
    '/api/checkout': './api/routes/create_checkout.cjs',
    '/api/register': './api/routes/users/db_new_user.cjs',
    '/api/check_user': './api/routes/users/check_user.cjs',
    '/api/add_address': './api/routes/users/db_register_address.cjs',
    '/api/get_address': './api/routes/users/db_retrieve_addresses.cjs',
    '/api/get_businesses': './api/routes/businesses/db_retrieve_business.cjs',
    '/api/delete_user': './api/routes/users/delete_user.cjs',
    '/api/get_schedule': './api/routes/businesses/db_retrieve_schedule.cjs',
    '/api/get_current_time': './api/routes/other/server_time.cjs',
    '/api/delete_address': './api/routes/users/db_delete_address.cjs',
    '/api/get_business_number': './api/routes/businesses/db_retrieve_business_data.cjs',
    '/api/login': './api/routes/users/login_user.cjs',
    '/api/send_verification_email': './api/routes/users/send_email_verification.cjs',
    '/api/verify_email': './api/routes/users/verify_email.cjs',
    '/api/get_business_details': './api/routes/businesses/db_retrieve_business_details.cjs',
    '/upload/producto': './api/routes/businesses/upload_products.cjs',
    '/upload/rubro': './api/routes/businesses/upload_categories.cjs',
    '/upload/estado_pedido': './api/routes/orders/upload_order_state.cjs',
  };

module.exports  = routes;
