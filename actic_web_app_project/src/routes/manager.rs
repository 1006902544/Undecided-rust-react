use crate::controller::manager::{
    auth::auth::*,
    game_center::{
        comments::comments::*,
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
    managers::{captcha::*, *},
    market::activity::*,
    material_library::images::*,
    permission::{
        associate::{associate::*, auth::*},
        permission::*,
    },
    role::*,
    router::{
        associate::{associate::*, auth::*},
        router::*,
    },
    upload::{get_access_key, get_static_image, upload_image},
    user::{
        email::{send_email, verify_email},
        user::*,
    },
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
                                    .service(get_spu_tree_limit)
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
                    )
                    .service(
                        web::scope("comments")
                            .service(get_comment_limit)
                            .service(delete_comment)
                            .service(recover_comment),
                    ),
            )
            .service(
                web::scope("materialLibrary")
                    .service(create_image)
                    .service(delete_image)
                    .service(get_images)
                    .service(batch_delete_images),
            )
            .service(
                web::scope("user")
                    .service(get_user_limit)
                    .service(unblock_user)
                    .service(banned_user)
                    .service(get_user_detail)
                    .service(
                        web::scope("email")
                            .service(send_email)
                            .service(verify_email),
                    ),
            )
            .service(
                web::scope("market").service(
                    web::scope("activity")
                        .service(get_activity_limit)
                        .service(get_activity_detail)
                        .service(update_activity_base)
                        .service(update_activity_info)
                        .service(delete_activity)
                        .service(get_activity_goods_limit)
                        .service(update_activity_base)
                        .service(update_activity_promotion_goods)
                        .service(update_activity_bundle_goods)
                        .service(delete_activity_goods_bundle)
                        .service(delete_activity_goods_promotion),
                ),
            )
            .service(
                web::scope("role")
                    .service(get_manager_roles)
                    .service(update_manager_role)
                    .service(delete_manager_role),
            )
            .service(
                web::scope("managers")
                    .service(get_managers_limit)
                    .service(manager_signup)
                    .service(update_manager_info)
                    .service(managers_sign_in)
                    .service(get_manager_info_by_token)
                    .service(
                        web::scope("captcha")
                            .service(send_manager_email)
                            .service(verify_manager_email),
                    ),
            ),
    );
}
