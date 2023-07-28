use mysql::prelude::*;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, ToSchema, Deserialize, Serialize, FromRow)]
pub struct AssociateRouterAuthReq {
    pub aid: u128,
    pub rkey: u128,
    ///1 = associate , 0 = disassociate
    pub associate: u8,
}
