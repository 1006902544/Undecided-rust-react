use crate::controller::manager::{
    auth::auth::*,
    game_center::{
        game_management::{
            sku::{
                notice::*,
                sku::{delete_sku, get_sku_limit, update_sku},
            },
            spu::{notice::*, spu::*, update_record::*},
        },
        general::{company_studio::company_studio::*, tags::tags::*, types::types::*},
    },
    manager_doc::ApiDoc,
    material_library::images::*,
    permission::{
        associate::{associate::*, auth::*},
        permission::*,
    },
    router::{
        associate::{associate::*, auth::*},
        router::*,
    },
    upload::{get_access_key, get_static_image, upload_image},
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
                    .service(get_static_image)
                    .service(get_access_key),
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
                web::scope("gamesCenter")
                    .service(
                        web::scope("general")
                            .service(
                                web::scope("tags")
                                    .service(get_tags_limit)
                                    .service(update_tags)
                                    .service(delete_tags)
                                    .service(get_tags_list),
                            )
                            .service(
                                web::scope("types")
                                    .service(get_game_types)
                                    .service(update_game_type)
                                    .service(delete_game_type)
                                    .service(get_types_list),
                            )
                            .service(
                                web::scope("companyStudio")
                                    .service(get_company)
                                    .service(update_company)
                                    .service(get_company_detail)
                                    .service(delete_company_studio)
                                    .service(get_company_list),
                            )
                            .service(web::scope("systems")),
                    )
                    .service(
                        web::scope("gamesManagement")
                            .service(
                                web::scope("spu")
                                    .service(update_spu)
                                    .service(get_spu_detail)
                                    .service(get_spu_limit)
                                    .service(delete_spu)
                                    .service(
                                        web::scope("updateRecord")
                                            .service(get_spu_update_record)
                                            .service(delete_spu_update_record)
                                            .service(update_spu_update_record),
                                    )
                                    .service(
                                        web::scope("notice")
                                            .service(get_spu_notice)
                                            .service(delete_spu_notice)
                                            .service(update_spu_notice),
                                    ),
                            )
                            .service(
                                web::scope("sku")
                                    .service(update_sku)
                                    .service(get_sku_limit)
                                    .service(delete_sku)
                                    .service(
                                        web::scope("notice")
                                            .service(get_sku_notice)
                                            .service(delete_sku_notice)
                                            .service(update_sku_notice),
                                    ),
                            ),
                    ),
            )
            .service(
                web::scope("materialLibrary")
                    .service(create_image)
                    .service(delete_image)
                    .service(get_images)
                    .service(batch_delete_images),
            ),
    );
}
