use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::app::error::MyError;

pub struct Limit {
    limit: u128,
    page: u128,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct LimitResults<T> {
    pub results: Option<Vec<T>>,
    pub current: u128,
    pub total: u128,
}

pub fn handle_limit(limit: &Option<String>) -> u128 {
    match limit.clone() {
        Some(limit) => match limit.parse::<u128>() {
            Ok(limit) => limit,
            Err(_) => 10,
        },
        None => 10,
    }
}

pub fn handle_page(page: &Option<String>) -> u128 {
    match page.clone() {
        Some(page) => match page.parse::<u128>() {
            Ok(page) => page,
            Err(_) => 1,
        },
        None => 1,
    }
}
