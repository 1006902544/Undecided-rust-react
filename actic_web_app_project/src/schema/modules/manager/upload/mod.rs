use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(ToSchema, Deserialize, Serialize, Clone)]
pub struct AccessKey {
    pub endpoint: &'static str,
    pub port: u64,
    pub use_ssl: bool,
    pub access_key: &'static str,
    pub secret_key: &'static str,
}
