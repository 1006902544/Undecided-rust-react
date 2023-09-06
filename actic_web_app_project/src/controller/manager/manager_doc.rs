use crate::schema::modules::{
    admin::admin::*,
    manager::{
        game_center::{
            comments::comments::*,
            game_management::{
                sku::{notice::*, sku::*},
                spu::{notice::*, spu::*, update_record::*},
            },
            general::{company_studio::company_studio::*, tags::tags::*, types::types::*},
        },
        manager::*,
        manager_response::*,
        material_library::images::*,
        permission::{
            associate::{associate::*, auth::*},
            permission::*,
        },
        router::{
            associate::{associate::*, auth::*},
            router::*,
        },
        upload::*,
        user::{email::*, user::*},
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
        super::router::associate::auth::get_auth_with_router,
        super::router::associate::associate::associate_auth_router,
        super::auth::auth::sign_in,
        super::auth::auth::get_admin_info,
        super::auth::auth::get_auth_limit,
        super::permission::permission::get_permission,
        super::permission::permission::get_permission,
        super::permission::permission::update_permission,
        super::permission::permission::delete_permission,
        super::permission::associate::auth::get_permission_auth,
        super::permission::associate::associate::associate,
        super::permission::associate::associate::disassociate,
        //素材库-图片
        super::material_library::images::create_image,
        super::material_library::images::delete_image,
        super::material_library::images::get_images,
        super::material_library::images::batch_delete_images,
        //游戏中心-通用-标签
        super::game_center::general::tags::tags::get_tags_limit,
        super::game_center::general::tags::tags::update_tags,
        super::game_center::general::tags::tags::delete_tags,
        super::game_center::general::tags::tags::get_tags_list,
        //upload,accessKey
        super::upload::get_access_key,
        //游戏中心-通用-类型
        super::game_center::general::types::types::get_game_types,
        super::game_center::general::types::types::update_game_type,
        super::game_center::general::types::types::delete_game_type,
        super::game_center::general::types::types::get_types_list,
        //游戏中心-通用-公司/工作室
        super::game_center::general::company_studio::company_studio::get_company,
        super::game_center::general::company_studio::company_studio::update_company,
        super::game_center::general::company_studio::company_studio::get_company_detail,
        super::game_center::general::company_studio::company_studio::delete_company_studio,
        super::game_center::general::company_studio::company_studio::get_company_list,
        //游戏中心-游戏管理-SPU-SPU管理
        super::game_center::game_management::spu::spu::update_spu,
        super::game_center::game_management::spu::spu::get_spu_detail,
        super::game_center::game_management::spu::spu::get_spu_limit,
        super::game_center::game_management::spu::spu::delete_spu,
        //游戏中心-游戏管理-SPU-更新记录
        super::game_center::game_management::spu::update_record::get_spu_update_record,
        super::game_center::game_management::spu::update_record::delete_spu_update_record,
        super::game_center::game_management::spu::update_record::update_spu_update_record,
        //游戏中心-游戏管理-SPU-公告
        super::game_center::game_management::spu::notice::get_spu_notice,
        super::game_center::game_management::spu::notice::update_spu_notice,
        super::game_center::game_management::spu::notice::delete_spu_notice,
        //游戏中心-游戏管理-SKU
        super::game_center::game_management::sku::sku::get_sku_limit,
        super::game_center::game_management::sku::sku::update_sku,
        super::game_center::game_management::sku::sku::delete_sku,
        //游戏中心-游戏管理-SKU-公告
        super::game_center::game_management::sku::notice::get_sku_notice,
        super::game_center::game_management::sku::notice::update_sku_notice,
        super::game_center::game_management::sku::notice::delete_sku_notice,
        //用户-验证码
        super::user::email::send_email,
        super::user::email::verify_email,
        //用户管理
        super::user::user::get_user_limit,
        super::user::user::get_user_detail,
        super::user::user::banned_user,
        super::user::user::unblock_user,
        //游戏中心-评论管理
        super::game_center::comments::comments::get_comment_limit,
        super::game_center::comments::comments::delete_comment,
        super::game_center::comments::comments::recover_comment,

    ),
    components(schemas(
        //文件通用
        FileObject,
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
        UpdateRouteReq,
        //通用
        List,
        //用户菜单权限相关
        AssociateRouterAuthLimitReq,AssociateRouterAuthLimit,RouterAssociateAuthRes,RouterAssociateAuthLimitRes,AssociateRouterAuthReq,
        //游戏标签
        Tag,UpdateTagReq,TagLimitReq,DeleteTagReq,GameTagsRes,GameTagsLimitRes,
        //上传，accessKey
        AccessKeyRes,AccessKey,
        //游戏类型
        GameType,UpdateGameTypeReq,DeleteGameTypeReq,GameTypeRes,GameTypeLimitRes,GameTypeLimitReq,
        //公司/工作室
        GetCompanyStudioReq,UpdateCompanyStudioReq,CompanyStudioDetail,CompanyStudio,CompanyStudioRes,CompanyStudioLimitRes,GetCompanyStudioDetailReq,DeleteCompanyStudioDetailReq,CompanyLocation,CompanyLocationRes,
        //spu
        SpuLimit,SpuDetail,UpdateSpuReq,GetSpuDetailReq,DeleteSpuDetailReq,GetSpuLimitReq, SpuFileObject,SpuRes,SpuLimitRes,SpuDetailRes,SpuUpdateRes,SpuUpdateResData,
        //spu更新记录
        SpuUpdateRecord,UpdateSpuUpdateRecord,SpuUpdateRecordLimitReq,SpuUpdateRecordDeleteReq,SpuUpdateRecordRes,SpuUpdateRecordLimitRes,UpdateSpuUpdateRecordResData,UpdateSpuUpdateRecordRes,
        //spu公告
        SpuNotice,SpuNoticeLimitReq,SpuNoticeUpdateReq,SpuNoticeDeleteReq,SpuNoticeRes,SpuNoticeLimitRes,SpuNoticeUpdateRes,SpuNoticeUpdateResData,
        //sku
        SkuDeleteReq,Sku,SkuUpdateReq,SkuLimitReq,SkuRes,SkuLimitRes,
        //sku公告
        SkuNotice,SkuNoticeLimitReq,SkuNoticeUpdateReq,SkuNoticeDeleteReq,SkuNoticeRes,SkuNoticeLimitRes,SkuNoticeUpdateRes,SkuNoticeUpdateResData,
        //素材库-图片
        ImagesObject,UpdateImageObjectReq,DeleteImageObjectReq,MaterialImageLimitReq,MaterialImageRes,MaterialImageLimitRes,BatchDeleteMaterialImagesReq,
        //用户-发送验证码
        SendEmailReq,EmailRow,
        //用户管理
        User,UserDetail,BannedUser,UnblockUser,GetUserLimitReq,UserLimitRes,UserRes,GetUserDetailReq,
        //评论管理
        Comment,DeleteCommentReq,CommentLimitReq,CommentRes,CommentLimitRes,RecoverCommentReq
    ))
)]
pub struct ApiDoc;
