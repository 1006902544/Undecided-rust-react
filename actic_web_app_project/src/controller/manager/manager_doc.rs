use crate::schema::modules::{
    admin::admin::*,
    manager::{
        manager_response::*,
        permission::{
            associate::{associate::*, auth::*},
            permission::*,
        },
        router::router::*,
    },
};
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        super::router::router::update_router,
        super::router::router::get_router,
        super::router::router::delete_router,
        super::router::router::get_all_router,
        super::auth::auth::sign_in,
        super::auth::auth::get_admin_info,
        super::auth::auth::get_auth_limit,
        super::permission::permission::get_permission,
        super::permission::permission::get_permission,
        super::permission::permission::update_permission,
        super::permission::permission::delete_permission,
        super::permission::associate::auth::get_permission_auth,
        super::permission::associate::associate::associate,
        super::permission::associate::associate::disassociate
    ),
    components(schemas(
        RoutesVecRes,
        ResPonseU8,
        ResPonseString,
        AdminInfoRes,
        AdminInfoListRes,
        Route,
        LoginBody,
        AdminInfo,
        AuthLimitRes,
        AuthRes,
        Permission,
        UpdatePermissionBody,
        PermissionLimitRes,
        PermissionLimitQuery,
        PermissionAssociateAuthReqBody,
        PermissionDisassociateAuthReqBody,
        DeletePermissionQuery,
        AssociateAuthLimit,
        AssociateAuthLimitReq,
        PermissionAssociateAuthLimitRes,
    ))
)]
pub struct ApiDoc;
