use std::{env, vec};

use actix_web::{http::header::AUTHORIZATION, HttpRequest};
use jsonwebtoken::{decode, encode, errors::Error, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::{middleware::auth_verify::UnlessTree, schema::modules::admin::admin::AdminInfo};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub exp: u128,
    pub id: u128,
    pub info: AdminInfo,
}

pub fn get_uid_by_token(req: &HttpRequest) -> Option<u128> {
    let auth = req.headers().get(AUTHORIZATION);
    match auth {
        Some(token) => {
            let claims = decode::<Claims>(
                token.to_str().unwrap(),
                &get_decode_key(),
                &Validation::default(),
            );
            match claims {
                Ok(info) => Some(info.claims.id),
                Err(_) => None,
            }
        }
        None => None,
    }
}

pub fn get_info_by_token(req: &HttpRequest) -> Option<AdminInfo> {
    let auth = req.headers().get(AUTHORIZATION);
    match auth {
        Some(token) => {
            let claims = decode::<Claims>(
                token.to_str().unwrap(),
                &get_decode_key(),
                &Validation::default(),
            );
            match claims {
                Ok(info) => Some(info.claims.info),
                Err(_) => None,
            }
        }
        None => None,
    }
}

pub fn is_manager(req: &HttpRequest) -> bool {
    match get_info_by_token(req) {
        Some(info) => {
            if info.level > 0 {
                true
            } else {
                false
            }
        }
        None => false,
    }
}

pub fn encode_default(info: AdminInfo) -> Result<String, Error> {
    encode(
        &Header::default(),
        &Claims {
            exp: 3600000000,
            id: info.id,
            info,
        },
        &get_encode_key(),
    )
}

pub fn get_encode_key() -> EncodingKey {
    let key = env::var("JWT_KEY").unwrap();
    let key = key.as_bytes();
    let key: EncodingKey = EncodingKey::from_secret(key.as_ref());
    key
}

pub fn get_decode_key() -> DecodingKey {
    let key = env::var("JWT_KEY").unwrap();
    let key = key.as_bytes();
    let key: DecodingKey = DecodingKey::from_secret(key.as_ref());
    key
}

pub fn get_unless_tree() -> Vec<UnlessTree> {
    vec![
        UnlessTree::new(
            "/admin",
            None,
            None,
            Some(vec![
                UnlessTree::new("/signUp", Some("POST"), None, None),
                UnlessTree::new("/signIn", Some("POST"), None, None),
                UnlessTree::new("/api-docs/openapi.json", Some("GET"), None, None),
            ]),
        ),
        UnlessTree::new(
            "/manager",
            None,
            None,
            Some(vec![
                UnlessTree::new("/api-docs/openapi.json", Some("GET"), None, None),
                UnlessTree::new(
                    "/auth",
                    None,
                    None,
                    Some(vec![UnlessTree::new("/signIn", Some("POST"), None, None)]),
                ),
                UnlessTree::new(
                    "/upload/static/assets",
                    Some("GET"),
                    Some(r"^/manager/upload/static/assets"),
                    None,
                ),
            ]),
        ),
    ]
}
