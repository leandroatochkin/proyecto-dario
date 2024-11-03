const host = import.meta.env.VITE_BACKEND_HOST


export const index = {
    request_products: `${host}/api/productos`,
    request_categories: `${host}/api/rubros`,
    create_checkout: `${host}/api/checkout/checkout`,
    register_user: `${host}/api/register`,
    check_user: `${host}/api/check_user`,
    add_address:  `${host}/api/add_address`,
    get_address:  `${host}/api/get_address`,
    get_businesses:  `${host}/api/get_businesses`,
    delete_user:   `${host}/api/delete_user`,
    get_schedule: `${host}/api/get_schedule`,
    get_current_time:  `${host}/api/get_current_time`,
    delete_address:   `${host}/api/delete_address`,
    get_business_number:  `${host}/api/get_business_number`,
    login_user:   `${host}/api/login`,
    send_verification_email:   `${host}/api/send_verification_email`,
    verify_email:   `${host}/api/verify_email`
}