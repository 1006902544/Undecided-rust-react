use crate::controller::manager::{
    auth::auth::*,
    game_center::general::tags::tags::*,
    manager_doc::ApiDoc,
    permission::{
        associate::{associate::*, auth::*},
        permission::*,
    },
    router::{
        associate::{associate::*, auth::*},
        router::*,
    },
    upload::{get_static_image, upload_image},
};
use actix_web::{web, web::ServiceConfig};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub fn manager_config(cfg: &mut ServiceConfig) {
    let base_url = "manager";
    cfg.service(
        web::scope(base_url)
            .service(
                web::scope("upload")
                    .service(upload_image)
                    .service(get_static_image),
            )
            .service(
                SwaggerUi::new("/swagger-ui/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::openapi()),
            )
            .service(
                web::scope("router")
                    .service(update_router)
                    .service(get_router)
                    .service(delete_router)
                    .service(get_all_router)
                    .service(
                        web::scope("associate")
                            .service(associate_auth_router)
                            .service(get_auth_with_router),
                    ),
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
            )
            .service(
                web::scope("gamesCenter").service(
                    web::scope("general")
                        .service(
                            web::scope("tags")
                                .service(get_tags_limit)
                                .service(update_tags)
                                .service(delete_tags),
                        )
                        .service(web::scope("types"))
                        .service(web::scope("companyStudio"))
                        .service(web::scope("systems")),
                ),
            ),
    );
}
