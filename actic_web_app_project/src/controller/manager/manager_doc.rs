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
        managers::{avatar_audit::*, captcha::*, *},
        market::activity::*,
        material_library::images::*,
        permission::permission::*,
        role::{audit::*, role_permission::*, role_router::*, *},
        router::router::*,
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
        super::auth::auth::sign_in,
        super::auth::auth::get_admin_info,
        super::auth::auth::get_auth_limit,
        super::permission::permission::get_permission,
        super::permission::permission::get_permission,
        super::permission::permission::update_permission,
        super::permission::permission::delete_permission,
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
        super::game_center::game_management::spu::spu::get_spu_tree_limit,
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
        //商城管理-活动管理
        super::market::activity::get_activity_limit,
        super::market::activity::get_activity_detail,
        super::market::activity::update_activity_base,
        super::market::activity::update_activity_info,
        super::market::activity::delete_activity,
        super::market::activity::get_activity_goods_limit,
        super::market::activity::update_activity_promotion_goods,
        super::market::activity::update_activity_bundle_goods,
        super::market::activity::delete_activity_goods_bundle,
        super::market::activity::delete_activity_goods_promotion,
        //管理端角色
        super::role::get_manager_roles,
        super::role::update_manager_role,
        super::role::delete_manager_role,
        //管理端角色-权限
        super::role::role_permission::get_manager_role_permissions,
        super::role::role_permission::change_role_permission_status,
        //管理端角色-路由
        super::role::role_router::get_manager_role_router,
        super::role::role_router::change_role_router_status,
        super::role::role_router::get_current_role_router,
        //管理端用户-角色审核
        super::role::audit::get_current_role_audit,
        super::role::audit::create_role_audit,
        super::role::audit::get_role_audit_limit,
        super::role::audit::audit_role_apply,
        super::role::audit::delete_role_audit,
        //管理端用户
        super::managers::get_managers_limit,
        super::managers::manager_signup,
        super::managers::update_manager_info,
        super::managers::managers_sign_in,
        super::managers::get_manager_info_by_token,
        //管理端用户-email验证码
        super::managers::captcha::send_manager_email,
        super::managers::captcha::verify_manager_email,
        //管理端用户-头像审核
        super::managers::avatar_audit::get_manager_avatar_audits,
        super::managers::avatar_audit::manager_avatar_audit,
        super::managers::avatar_audit::delete_manager_avatar_audit,
        super::managers::avatar_audit::manager_avatar_apply,
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
        DeletePermissionQuery,
        UpdateRouteReq,
        //通用
        List,
        //游戏标签
        Tag,UpdateTagReq,TagLimitReq,DeleteTagReq,GameTagsRes,GameTagsLimitRes,
        //上传，accessKey
        AccessKeyRes,AccessKey,
        //游戏类型
        GameType,UpdateGameTypeReq,DeleteGameTypeReq,GameTypeRes,GameTypeLimitRes,GameTypeLimitReq,
        //公司/工作室
        GetCompanyStudioReq,UpdateCompanyStudioReq,CompanyStudioDetail,CompanyStudio,CompanyStudioRes,CompanyStudioLimitRes,GetCompanyStudioDetailReq,DeleteCompanyStudioDetailReq,CompanyLocation,CompanyLocationRes,
        //spu
        SpuLimit,SpuDetail,UpdateSpuReq,GetSpuDetailReq,DeleteSpuDetailReq,GetSpuLimitReq, SpuFileObject,SpuRes,SpuLimitRes,SpuDetailRes,SpuUpdateRes,SpuUpdateResData,SpuSkuTreeRes
        ,SpuSkuTreeLimitRes,SpuSkuTree,SpuTreeChildren,GetSpuTreeReq,
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
        Comment,DeleteCommentReq,CommentLimitReq,CommentRes,CommentLimitRes,RecoverCommentReq,
        //商城管理-活动管理
        ActivityUpdateStepOneReq,ActivityUpdateStepTwoReq,ActivityBundleInsertGoodsReq,ActivityBundleDeleteGoodsReq,ActivityPromotionUpdateGoodsReq,ActivityPromotionDeleteGoodsReq,ActivityBaseDetail,ActivityInfoDetail,ActivityDetail,ActivityGoods,ActivityGoodsLimitReq,Activity,ActivityLimitReq,ActivityRes,ActivityGoodsRes,ActivityDetailRes,ActivityLimitRes,ActivityGoodsLimitRes,ActivityDetailReq,DeleteActivityReq,ActivityBundleInsertGoods,ActivityPromotionUpdateGoods,
        //管理端角色
        ManagerRole,ManagerRoleUpdateReq,ManagerRoleReq,ManagerRoleDeleteReq,ManagerRoleList,ManagerRoleRes,ManagerRoleLimitRes,
        //管理端用户
        ManagerInfoRes,ManagerInfoLimitRes,ManagerInfo,GetManagerInfoReq,ManagerSignupAccount,ManagerInfoUpdate,ManagerSignIn,ManagerInfoLimitReq,DeleteManager,ManagerInfoDetailData,ManagerInfoWithToken,ManagerInfoWithTokenData,
        //管理端用户-权限
        ManagerRolePermissionRow,ManagerRolePermissionRowReq,ManagerRolePermissionStatusReq,ManagerRolePermissionRowRes,ManagerRolePermissionRowLimitRes,
        //管理端用户-路由
        ManagerRoleRouterRow,ManagerRoleRouterReq,ManagerRoleRouterStatusReq,ManagerRoleRouterRowRes,ManagerRoleRouterRowLimitRes,
          //管理端用户email验证码
        SendManagerEmailResData,SendManagerEmailReq,SendManagerEmailRes,ManagerEmailRow,
        //管理端用户角色申请/审核
        RoleAuditRowRes,CurrentRoleAuditRes,RoleAuditRowLimitRes,RoleAuditRow,ApplyRoleReq,ApplyRoleReq,RoleAuditReq,RoleAuditLimitReq,RoleAuditDeleteReq,
        //管理端用户-头像审核
        ManagerAvatarAuditRow,ManagerAvatarLimitReq,ManagerAvatarAuditReq,ManagerAvatarAuditDeleteReq,ManagerAvatarAuditRowLimitRes,ManagerAvatarAuditRowRes,ManagerAvatarApplyReq
    ))
)]
pub struct ApiDoc;
