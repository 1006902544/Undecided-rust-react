use actix_web::web::Json;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::{
    game_center::general::{
        tags::tags::*,
        types::types::{DeleteGameTypeReq, GameType, UpdateGameTypeReq},
    },
    permission::{associate::auth::*, permission::Permission},
    router::{associate::auth::*, router::*},
    upload::*,
};
use crate::schema::modules::admin::admin::AdminInfo;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[aliases(
    RoutesVecRes = ResponseData<Vec<Route>>,
    ResPonseU8 = ResponseData<u8>,
    ResPonseString = ResponseData<String>,
    AdminInfoRes = ResponseData<AdminInfo>,
    AdminInfoListRes = ResponseData<Vec<AdminInfo>>,
    AuthLimitRes = ResponseData<AuthRes>,
    PermissionLimitRes = ResponseData<PermissionRes>,
    PermissionAssociateAuthLimitRes = ResponseData<PermissionAssociateAuthRes>,
    RouterAssociateAuthLimitRes = ResponseData<RouterAssociateAuthRes>,
    //游戏标签limit
    GameTagsRes = ResponseData<GameTagsLimitRes>,
    //上传，accessKey
    AccessKeyRes = ResponseData<AccessKey>,
    //游戏类型
    GameTypeRes = ResponseData<GameTypeLimitRes>
)]
pub struct ResponseData<B> {
    pub data: B,
    pub message: &'static str,
    pub status: i64,
}

impl<B> ResponseData<B> {
    pub fn into_json_response(self) -> Json<Self> {
        Json(self)
    }

    pub fn new(data: B) -> ResponseData<B> {
        ResponseData {
            data,
            message: "success",
            status: 200,
        }
    }

    #[allow(unused)]
    pub fn new_with_status_message(data: B, status: i64, message: &'static str) -> Self {
        ResponseData {
            data,
            message,
            status,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[aliases(
    AuthRes = LimitResults<AdminInfo>,
    PermissionRes = LimitResults<Permission>,
    PermissionAssociateAuthRes = LimitResults<AssociateAuthLimit>,
    RouterAssociateAuthRes = LimitResults<AssociateRouterAuthLimit>,
    //游戏标签
    GameTagsLimitRes = LimitResults<Tag>,
    //游戏类型
    GameTypeLimitRes = LimitResults<GameType>
)]
pub struct LimitResults<T> {
    pub results: Option<Vec<T>>,
    pub current: u128,
    pub total: u128,
}
