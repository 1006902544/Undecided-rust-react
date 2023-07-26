use crate::controller::{
    admin::{get_admin_info, index as controller_index, sign_in, sign_up},
    admin_doc::ApiDoc,
};
use actix_web::{web, web::ServiceConfig};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

pub fn admin_config(cfg: &mut ServiceConfig) {
    let base_url = "admin";
    cfg.service(
        web::scope(base_url)
            .service(
                SwaggerUi::new("/swagger-ui/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::openapi()),
            )
            .service(controller_index)
            .service(get_admin_info)
            .service(sign_in)
            .service(sign_up),
    );
}
