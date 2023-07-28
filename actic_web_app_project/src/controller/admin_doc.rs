use crate::{
    app::error::MyError,
    schema::modules::admin::{admin::*, admin_response::*},
};
use actix_web::http::StatusCode;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        super::admin::get_admin_info,
        super::admin::sign_up,
        super::admin::sign_in,
    ),
    components(schemas(AdminInfoRes, AdminInfo, SignInRes, SignUpRes, LoginBody, SignUpReq))
)]
pub struct ApiDoc;

pub fn get_api_doc() -> Result<String, MyError> {
    match ApiDoc::openapi().to_pretty_json() {
        Ok(doc) => Ok(doc),
        Err(err) => Err(MyError {
            name: err.to_string(),
            status: Some(StatusCode::NOT_FOUND),
        }),
    }
}
