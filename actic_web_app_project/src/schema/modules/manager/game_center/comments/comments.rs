use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, ToSchema, FromRow, Deserialize, Serialize)]
pub struct Comment {
    pub id: u64,
    pub user_id: u64,
    pub username: String,
    pub nickname: String,
    pub spu_id: u64,
    pub spu_name: String,
    pub content: String,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    pub like: u64,
    pub dislike: u64,
    pub comment_type: String,
    pub reply_id: Option<u64>,
    pub reply_uid: Option<u64>,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, IntoParams)]
pub struct DeleteCommentReq {
    pub id: u64,
    pub delete_type: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize, IntoParams)]
pub struct CommentLimitReq {
    pub limit: Option<u64>,
    pub page: Option<u64>,
    pub id: Option<u64>,
    pub reply_id: Option<u64>,
    pub user_id: Option<u64>,
    pub spu_id: Option<u64>,
    pub comment_type: Option<String>,
    pub status: String,
}

#[derive(Debug, Clone, ToSchema, Deserialize, Serialize)]
pub struct RecoverCommentReq {
    pub id: u64,
}
