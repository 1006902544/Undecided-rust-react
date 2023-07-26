use actix_http::body::{BoxBody, MessageBody};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    web::Bytes,
    Error, HttpResponse,
};
use futures_util::future::LocalBoxFuture;
use serde::{Deserialize, Serialize};

use std::{
    future::{ready, Ready},
    rc::Rc,
};

pub struct MyResponse;

impl<S, B> Transform<S, ServiceRequest> for MyResponse
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static + MessageBody,
{
    type Response = ServiceResponse<BoxBody>;
    type Error = Error;
    type InitError = ();
    type Transform = MyResponseMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(MyResponseMiddleware {
            service: Rc::new(service),
        }))
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MyRes<B: 'static + MessageBody> {
    code: i64,
    data: B,
}

pub struct MyResponseMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for MyResponseMiddleware<S>
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

            let bytes = match cur_res.into_body().try_into_bytes() {
                Ok(b) => b,
                Err(_) => Bytes::new(),
            };

            let builder = HttpResponse::Created()
                .status(status)
                .content_type("application/json")
                .body(bytes);

            let new_res = ServiceResponse::new(cur_req, builder);

            Ok(new_res)
        })
    }
}
