use std::{env, vec};

use actix_web::{http::header::AUTHORIZATION, HttpRequest};
use jsonwebtoken::{decode, encode, errors::Error, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::{middleware::auth_verify::UnlessTree, schema::modules::manager::managers::ManagerInfo};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub exp: u128,
    pub id: u64,
    pub info: ManagerInfo,
}

pub fn get_uid_by_token(req: &HttpRequest) -> Option<u64> {
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

pub fn get_info_by_token(req: &HttpRequest) -> Option<ManagerInfo> {
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

pub fn encode_default(info: ManagerInfo) -> Result<String, Error> {
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
                    "/upload/static",
                    Some("GET"),
                    Some(r"^/manager/upload/static/"),
                    None,
                ),
                UnlessTree::new(
                    "/user/email",
                    Some("POST"),
                    Some(r"^/manager/user/email"),
                    None,
                ),
                UnlessTree::new(
                    "/managers",
                    Some("POST"),
                    Some(r"^/manager/managers"),
                    Some(vec![UnlessTree::new(
                        "/captcha",
                        Some("POST"),
                        Some(r"^/manager/managers/captcha"),
                        None,
                    )]),
                ),
            ]),
        ),
    ]
}
