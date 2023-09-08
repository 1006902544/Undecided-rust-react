use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ActivityUpdateStepOneReq {
    pub id: Option<u64>,
    pub title: String,
    pub subtitle: String,
    pub content: String,
    pub cover_url: String,
    pub cover_name: String,
    pub activity_type: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ActivityUpdateStepTwoReq {
    pub id: u64,
    pub activity_type: String,
    pub price: Option<f64>,
    pub discount: Option<f64>,
    pub publish_type: String,
    pub publish_time: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
}

//handle goods
#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ActivityBundleInsertGoodsReq {
    pub id: u64,
    pub spu_id: u64,
    pub spu_name: String,
    pub sku_id: Option<u64>,
    pub sku_name: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ActivityBundleDeleteGoodsReq {
    pub id: u64,
    pub spu_id: u64,
    pub sku_id: Option<u64>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ActivityPromotionUpdateGoodsReq {
    pub id: u64,
    pub spu_id: u64,
    pub spu_name: String,
    pub sku_id: Option<u64>,
    pub sku_name: Option<String>,
    pub discount: Option<f32>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ActivityPromotionDeleteGoodsReq {
    pub id: u64,
    pub spu_id: u64,
    pub sku_id: Option<u64>,
}

//activity detail
#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ActivityDetailReq {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct ActivityBaseDetail {
    pub id: u64,
    pub title: String,
    pub subtitle: String,
    pub content: String,
    pub cover_url: String,
    pub cover_name: String,
    pub activity_type: String,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct ActivityInfoDetail {
    pub price: Option<f64>,
    pub discount: Option<f32>,
    pub publish_type: String,
    #[schema(value_type = Option<String>)]
    pub publish_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub start_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub end_time: Option<NaiveDateTime>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema)]
pub struct ActivityDetail {
    pub base: ActivityBaseDetail,
    pub info: Option<ActivityInfoDetail>,
}

//activity spu/sku limit
#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct ActivityGoods {
    pub id: u64,
    pub spu_id: u64,
    pub spu_name: String,
    pub sku_id: Option<u64>,
    pub sku_name: Option<String>,
    pub discount: Option<f32>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ActivityGoodsLimitReq {
    pub id: u64,
    pub goods_type: String,
    pub spu_name: Option<String>,
    pub sku_name: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct DeleteActivityReq {
    pub id: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct Activity {
    pub id: u64,
    pub title: String,
    pub subtitle: String,
    pub cover_url: String,
    pub activity_type: String,
    pub publish_type: Option<String>,
    #[schema(value_type = Option<String>)]
    pub publish_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub start_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub end_time: Option<NaiveDateTime>,
    #[schema(value_type = Option<String>)]
    pub create_time: Option<NaiveDateTime>,
}

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, IntoParams)]
pub struct ActivityLimitReq {
    pub id: Option<u64>,
    pub title: Option<String>,
    pub activity_type: Option<String>,
    pub limit: Option<u64>,
    pub page: Option<u64>,
}
