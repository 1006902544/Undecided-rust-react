use actix_web::{
    delete, get, post,
    web::{Data, Json, Query},
    HttpRequest, Responder, ResponseError,
};
use mysql::Pool;

use crate::{
    app::error::MyError,
    schema::modules::manager::{
        game_center::general::company_studio::company_studio::*, manager_response::ResponseData,
    },
    server::manager::{
        game_center::general::company_studio::company_studio as company_studio_server,
        permissions::has_permission,
    },
};

#[utoipa::path(
  post,
  path = "/manager/gamesCenter/general/companyStudio",
  request_body = UpdateCompanyStudioReq,
  responses (
      (status = 200 ,description = "success" , body = ResPonseString)
  )
)]
#[post("")]
///update company/studio
pub async fn update_company(
    pool: Data<Pool>,
    body: Json<UpdateCompanyStudioReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        match body.id {
            Some(_) => {
                let res = company_studio_server::edit_company(&mut conn, body.into_inner()).await;
                match res {
                    Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                    Err(e) => Err(e),
                }
            }
            None => {
                let res = company_studio_server::create_company(&mut conn, body.into_inner()).await;
                match res {
                    Ok(res) => Ok(ResponseData::new(res).into_json_response()),
                    Err(e) => Err(e),
                }
            }
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
  get,
  path = "/manager/gamesCenter/general/companyStudio",
  params (GetCompanyStudioReq),
  responses (
      (status = 200 ,description = "success" , body = CompanyStudioRes)
  )
)]
#[get("")]
///get company/studio
pub async fn get_company(
    pool: Data<Pool>,
    query: Query<GetCompanyStudioReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = company_studio_server::get_company(&mut conn, query.into_inner()).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    get,
    path = "/manager/gamesCenter/general/companyStudio/detail",
    params (GetCompanyStudioDetailReq),
    responses (
        (status = 200 ,description = "success" , body = CompanyStudioDetailRes)
    )
  )]
#[get("/detail")]
///get company/studio detail
pub async fn get_company_detail(
    pool: Data<Pool>,
    query: Query<GetCompanyStudioDetailReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = company_studio_server::get_company_studio_detail(&mut conn, query.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    delete,
    path = "/manager/gamesCenter/general/companyStudio",
    params (DeleteCompanyStudioDetailReq),
    responses (
        (status = 200 ,description = "success" , body = ResPonseString)
    )
  )]
#[delete("")]
///delete company/studio
pub async fn delete_company_studio(
    pool: Data<Pool>,
    query: Query<DeleteCompanyStudioDetailReq>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    let has_per = has_permission(&mut conn, &req);
    if has_per {
        let res = company_studio_server::delete_company_studio(&mut conn, query.id).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}

#[utoipa::path(
    get,
    path = "/manager/gamesCenter/general/companyStudio/list",
    responses (
    (status = 200 , body = ListRes , description = "success")
    )
)]
#[get("/list")]
///get company list
pub async fn get_company_list(
    pool: Data<Pool>,
    req: HttpRequest,
) -> Result<impl Responder, impl ResponseError> {
    let mut conn = pool.get_conn().unwrap();
    if has_permission(&mut conn, &req) {
        let res = company_studio_server::get_company_list(&mut conn).await;
        match res {
            Ok(res) => Ok(ResponseData::new(res).into_json_response()),
            Err(e) => Err(e),
        }
    } else {
        Err(MyError::permissions_error())
    }
}
