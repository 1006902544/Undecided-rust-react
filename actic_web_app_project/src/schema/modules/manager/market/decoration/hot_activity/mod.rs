use chrono::NaiveDateTime;
use mysql_common::prelude::FromRow;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Deserialize, Serialize, ToSchema, FromRow)]
pub struct HotActivity {
    pub id: u64,
    pub activity_id: u64,
    pub activity_url: String,
    pub sort: u64,
    #[schema(value_type = String)]
    pub create_time: NaiveDateTime,
    #[schema(value_type = String)]
    pub update_time: NaiveDateTime,
}
