use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Deserialize, Serialize, ToSchema)]
pub struct FileObject {
    pub e_tag: String,
    pub url: String,
    pub filename: String,
}
