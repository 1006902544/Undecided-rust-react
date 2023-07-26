use actix_http::body::{BoxBody, MessageBody};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    web::Bytes,
    Error, HttpResponse,
};

use futures_util::future::LocalBoxFuture;
use serde::{Deserialize, Serialize};
use serde_json::json;

use std::{
    future::{ready, Ready},
    rc::Rc,
};

pub struct ErrorResponse;

impl<S, B> Transform<S, ServiceRequest> for ErrorResponse
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static + MessageBody,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type InitError = ();
    type Transform = ErrorResponseMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(ErrorResponseMiddleware {
            service: Rc::new(service),
        }))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MyError<'a> {
    status: i64,
    message: &'a str,
}

pub struct ErrorResponseMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for ErrorResponseMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static + MessageBody,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let svc = self.service.clone();

        Box::pin(async move {
            let res: ServiceResponse<B> = svc.call(req).await?;
            let (cur_req, cur_res) = res.into_parts();

            let status = cur_res.status().clone();
            let is_err = cur_res.error();

            match is_err {
                Some(e) => {
                    let bytes = e.as_response_error().to_string().into_bytes();
                    let msg = String::from_utf8(bytes).unwrap();
                    let e = MyError {
                        status: status.as_u16() as i64,
                        message: msg.as_str(),
                    };
                    let value = json!(e);
                    let u8s = serde_json::to_vec(&value).unwrap();
                    let bytes = Bytes::from(u8s);
                    let builder = HttpResponse::Created()
                        .status(status)
                        .content_type("application/json")
                        .body(bytes);
                    let new_res = ServiceResponse::new(cur_req, builder);
                    Ok(new_res)
                }
                None => {
                    let new_res = ServiceResponse::new(cur_req, cur_res.map_into_boxed_body());
                    Ok(new_res)
                }
            }
        })
    }
}
