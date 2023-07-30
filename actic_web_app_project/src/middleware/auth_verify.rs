use std::{
    future::{ready, Ready},
    rc::Rc,
};

use actix_web::{
    body::{BoxBody, EitherBody, MessageBody},
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    http::{header::AUTHORIZATION, StatusCode},
    web::Bytes,
    Error, HttpResponse,
};
use futures_util::future::LocalBoxFuture;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Deserialize, Serialize)]
pub struct AuthErr {
    status: u128,
    message: String,
}

#[derive(Debug, Clone)]
pub struct Unless {
    pub path: String,
    pub method: String,
}

impl Unless {
    pub fn is_same(&self, other: &Unless) -> bool {
        self.path == other.path && self.method == other.method
    }

    #[allow(unused)]
    pub fn new(path: &str, method: &str) -> Self {
        Unless {
            path: path.to_string(),
            method: method.to_string(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct UnlessTree {
    pub path: String,
    pub method: Option<String>,
    pub children: Option<Vec<UnlessTree>>,
}

impl UnlessTree {
    pub fn new(path: &str, method: Option<&str>, children: Option<Vec<Self>>) -> Self {
        UnlessTree {
            path: path.to_string(),
            method: match method {
                Some(m) => Some(m.to_string()),
                None => None,
            },
            children,
        }
    }
}

pub fn handle_unless_tree(vecs: Vec<UnlessTree>, scope: Option<String>) -> Vec<Unless> {
    let mut arr: Vec<Unless> = Vec::new();
    let scope = match scope {
        Some(str) => str,
        None => "".to_string(),
    };
    for unless in vecs {
        let path = format!("{}{}", scope, unless.path);

        match unless.method {
            Some(method) => {
                arr.push(Unless {
                    path: path.clone(),
                    method,
                });
            }
            None => {}
        }

        match unless.children {
            Some(children) => {
                let child_arr = handle_unless_tree(children, Some(path));
                arr = [arr, child_arr].concat();
            }
            None => {}
        };
    }
    arr
}

pub struct Auth;

impl<S, B> Transform<S, ServiceRequest> for Auth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: MessageBody,
{
    type Response = ServiceResponse<EitherBody<B, BoxBody>>;
    type Error = Error;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
    type Transform = AuthMiddleware<S>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthMiddleware {
            service: Rc::new(service),
        }))
    }
}

pub struct AuthMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: MessageBody,
{
    type Response = ServiceResponse<EitherBody<B, BoxBody>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let cur_svs = self.service.clone();

        Box::pin(async move {
            let mut could_pass = false;
            let path = req.path().to_string();
            let method = req.method().as_str().to_string();
            let cur_unless = Unless { path, method };

            let app_data = req.app_data::<Vec<UnlessTree>>();

            let auth = req.headers().get(AUTHORIZATION);
            match auth {
                Some(_auth) => could_pass = true,
                None => {
                    match app_data {
                        Some(unless_tree) => {
                            let unless = handle_unless_tree(unless_tree.clone(), None);
                            for conf in unless {
                                if cur_unless.is_same(&conf) {
                                    could_pass = true;
                                    break;
                                }
                            }
                        }
                        None => (),
                    };
                }
            };

            if could_pass {
                let cur_res = cur_svs.call(req).await?;
                Ok(cur_res.map_into_left_body())
            } else {
                let (cur_req, _) = req.into_parts();
                let e = AuthErr {
                    status: 401,
                    message: "auth error".to_string(),
                };
                let value = json!(e);
                let u8s = serde_json::to_vec(&value).unwrap();
                let bytes = Bytes::from(u8s);
                let builder = HttpResponse::Created()
                    .status(StatusCode::UNAUTHORIZED)
                    .content_type("application/json")
                    .body(bytes);
                let new_res: ServiceResponse<BoxBody> = ServiceResponse::new(cur_req, builder);
                Ok(new_res.map_into_right_body())
            }
        })
    }
}
