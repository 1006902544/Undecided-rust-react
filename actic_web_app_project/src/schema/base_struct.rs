use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct LimitResults<T> {
    pub results: Option<Vec<T>>,
    pub current: u128,
    pub total: u128,
}

pub fn handle_limit(limit: &Option<impl ToString>) -> u128 {
    match limit.clone() {
        Some(limit) => match limit.to_string().parse::<u128>() {
            Ok(limit) => limit,
            Err(_) => 10,
        },
        None => 10,
    }
}

pub fn handle_page(page: &Option<impl ToString>) -> u128 {
    match page.clone() {
        Some(page) => match page.to_string().parse::<u128>() {
            Ok(page) => page,
            Err(_) => 1,
        },
        None => 1,
    }
}
