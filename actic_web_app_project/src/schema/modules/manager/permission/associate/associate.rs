use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct PermissionAssociateAuthReqBody {
    pub uid: u128,
    pub pid: u128,
}

#[derive(Debug, Serialize, Deserialize, Clone, ToSchema)]
pub struct PermissionDisassociateAuthReqBody {
    pub uid: String,
    pub pid: String,
}
