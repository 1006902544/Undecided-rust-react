use crate::controller::manager::{
    auth::auth::*,
    manager_doc::ApiDoc,
    permission::{
        associate::{associate::*, auth::*},
        permission::*,
    },
    router::router::*,
};
use actix_web::{web, web::ServiceConfig};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub fn manager_config(cfg: &mut ServiceConfig) {
    let base_url = "manager";
    cfg.service(
        web::scope(base_url)
            .service(
                SwaggerUi::new("/swagger-ui/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::openapi()),
            )
            .service(
                web::scope("router")
                    .service(update_router)
                    .service(get_router)
                    .service(delete_router)
                    .service(get_all_router),
            )
            .service(
                web::scope("auth")
                    .service(get_admin_info)
                    .service(sign_in)
                    .service(get_auth_limit),
            )
            .service(
                web::scope("permission")
                    .service(get_permission)
                    .service(delete_permission)
                    .service(update_permission)
                    .service(
                        web::scope("associate")
                            .service(associate)
                            .service(disassociate)
                            .service(get_permission_auth),
                    ),
            ),
    );
}
