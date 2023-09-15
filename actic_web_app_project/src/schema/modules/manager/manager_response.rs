use actix_web::web::Json;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::{
    game_center::{
        comments::comments::*,
        game_management::{
            sku::{notice::*, sku::Sku},
            spu::{notice::*, spu::*, update_record::*},
        },
        general::{company_studio::company_studio::*, tags::tags::*, types::types::GameType},
    },
    managers::ManagerInfo,
    market::activity::*,
    material_library::images::ImagesObject,
    permission::{associate::auth::*, permission::Permission},
    role::ManagerRole,
    router::{associate::auth::*, router::*},
    upload::*,
    user::user::*,
};
use crate::schema::modules::admin::admin::AdminInfo;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[aliases(
    RoutesVecRes = ResponseData<Vec<Route>>,
    ResPonseU8 = ResponseData<u8>,
    ResPonseString = ResponseData<String>,
    ResponseU64 = ResponseData<u64>,
    AdminInfoRes = ResponseData<AdminInfo>,
    AdminInfoListRes = ResponseData<Vec<AdminInfo>>,
    AuthLimitRes = ResponseData<AuthRes>,
    PermissionLimitRes = ResponseData<PermissionRes>,
    PermissionAssociateAuthLimitRes = ResponseData<PermissionAssociateAuthRes>,
    RouterAssociateAuthLimitRes = ResponseData<RouterAssociateAuthRes>,
    //通用
    ListRes = ResponseData<Vec<List>>,
    //游戏标签limit
    GameTagsRes = ResponseData<GameTagsLimitRes>,
    //上传，accessKey
    AccessKeyRes = ResponseData<AccessKey>,
    //游戏类型
    GameTypeRes = ResponseData<GameTypeLimitRes>,
    //公司/工作室
    CompanyStudioRes = ResponseData<CompanyStudioLimitRes>,CompanyStudioDetailRes = ResponseData<CompanyStudioDetail>,
    //spu
    SpuRes = ResponseData<SpuLimitRes>,SpuDetailRes = ResponseData<SpuDetail>,SpuUpdateResData = ResponseData<SpuUpdateRes>,SpuSkuTreeRes = ResponseData<SpuSkuTreeLimitRes>,
    //spu-更新记录
    SpuUpdateRecordRes = ResponseData<SpuUpdateRecordLimitRes>,UpdateSpuUpdateRecordResData=ResponseData<UpdateSpuUpdateRecordRes>,
    //spu-公告
    SpuNoticeRes = ResponseData<SpuNoticeLimitRes>,SpuNoticeUpdateResData = ResponseData<SpuNoticeUpdateRes>,
    //sku,
    SkuRes = ResponseData<SkuLimitRes>,
    //sku-公告
    SkuNoticeRes = ResponseData<SkuNoticeLimitRes>,SkuNoticeUpdateResData= ResponseData<SkuNoticeUpdateRes>,
    //素材库-图片
    MaterialImageRes = ResponseData<MaterialImageLimitRes>,
    //用户管理
    UserRes = ResponseData<UserLimitRes>,UserDetailRes = ResponseData<UserDetail>,
    //游戏中心-评论
    CommentRes = ResponseData<CommentLimitRes>,
    //商城管理-活动管理
    ActivityRes= ResponseData<ActivityLimitRes>,ActivityGoodsRes = ResponseData<ActivityGoodsLimitRes>,ActivityDetailRes=ResponseData<ActivityDetail>,
    //管理端角色
    ManagerRoleRes = ResponseData<ManagerRoleLimitRes>,
    //管理端用户
    ManagerInfoRes = ResponseData<ManagerInfoLimitRes>

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
    GameTypeLimitRes = LimitResults<GameType>,
    //公司/工作室
    CompanyStudioLimitRes = LimitResults<CompanyStudio>,
    //spu
    SpuLimitRes = LimitResults<SpuLimit>,SpuSkuTreeLimitRes = LimitResults<SpuSkuTree>,
    //spu更新记录
    SpuUpdateRecordLimitRes = LimitResults<SpuUpdateRecord>,
    //spu公告
    SpuNoticeLimitRes = LimitResults<SpuNotice>,
    //sku
    SkuLimitRes = LimitResults<Sku>,
    //sku公告
    SkuNoticeLimitRes = LimitResults<SkuNotice>,
    //素材库-图片
    MaterialImageLimitRes = LimitResults<ImagesObject>,
    //用户管理
    UserLimitRes = LimitResults<User>,
    //游戏中心
    CommentLimitRes = LimitResults<Comment>,
    //商城管理-活动管理
    ActivityLimitRes = LimitResults<Activity>,ActivityGoodsLimitRes = LimitResults<ActivityGoods>,
    //管理端角色
    ManagerRoleLimitRes = LimitResults<ManagerRole>,
    //管理端用户
    ManagerInfoLimitRes = LimitResults<ManagerInfo>,
)]
pub struct LimitResults<T> {
    pub results: Option<Vec<T>>,
    pub current: u128,
    pub total: u128,
}

//list（select）通用
#[derive(Debug, Serialize, Deserialize, ToSchema, Clone, FromRow)]
pub struct List {
    pub label: String,
    pub value: String,
}
