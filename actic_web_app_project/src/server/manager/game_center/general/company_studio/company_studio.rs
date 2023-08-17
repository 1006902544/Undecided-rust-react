use actix_web::Responder;
use mysql::{from_row, prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            game_center::general::company_studio::company_studio::*,
            manager_response::CompanyStudioLimitRes,
        },
    },
    server::manager::game_center::general::tags::tags::after_update,
};

pub async fn create_company(
    conn: &mut PooledConn,
    body: UploadCompanyStudioReq,
) -> Result<impl Responder, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "insert into company_studios (name,logo_url,description,region,founder,established_time) values(:name,:logo_url,:description,:region,:founder,:established_time)";
    let res = trans.exec_drop(
        sql_str,
        params! {
          "name" => body.name,
          "logo_url" => body.logo_url,
          "description" => body.description,
          "region" => body.region,
          "founder" => body.founder,
          "established_time" => body.established_time,
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Create Success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn edit_company(
    conn: &mut PooledConn,
    body: UploadCompanyStudioReq,
) -> Result<impl Responder, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "update company_studios set name=:name logo_url=:logo_url description=:description region=:region founder=:founder established_time=:established_time where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
          "name" => body.name,
          "logo_url" => body.logo_url,
          "description" => body.description,
          "region" => body.region,
          "founder" => body.founder,
          "established_time" => body.established_time,
          "id" => body.id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Edit Success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_company(
    conn: &mut PooledConn,
    req: GetCompanyStudioReq,
) -> Result<CompanyStudioLimitRes, MyError> {
    let sql_str = "select * from company_studios where (id=:id or :id is null) and (name=:name or :name is null) and (region=:region or :region is null) and (founder=:founder or :founder is null) order by update_time limit :scope,:limit";
    let limit = handle_limit(&req.limit);
    let page = handle_page(&req.page);
    let res = conn.exec_map(
        sql_str,
        params! {
          "id" => req.id,
          "name" => req.name,
          "region" => req.region,
          "founder" => req.founder,
          "scope" => limit*(page-1),
          "limit" => limit
        },
        |row| from_row::<CompanyStudio>(row),
    );
    let total = get_total(conn);
    let current = get_current(total, page, limit);
    match res {
        Ok(results) => Ok(CompanyStudioLimitRes {
            results: Some(results),
            total,
            current,
        }),
        Err(err) => Err(MyError::sql_error(err)),
    }
}
