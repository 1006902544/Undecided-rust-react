use mysql::{from_row, prelude::Queryable, Params, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{batch_exec, get_current, get_total, BatchExec},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::{
            game_center::general::company_studio::company_studio::*,
            manager_response::{CompanyStudioLimitRes, List},
        },
    },
    server::manager::game_center::general::tags::tags::after_update,
};

pub async fn create_company(
    conn: &mut PooledConn,
    body: UpdateCompanyStudioReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str: &str = "insert into company_studios (name,logo_url,description,region,founder,established_time,e_tag,logo_name) values (:name,:logo_url,:description,:region,:founder,:established_time,:e_tag,:logo_name);
    ";

    let res = trans.exec_drop(
        sql_str,
        params! {
            "name" => body.name,
            "logo_url" => body.logo_url,
            "description" => body.description,
            "region" => body.region,
            "founder" => body.founder,
            "established_time" => body.established_time,
            "e_tag" => body.e_tag,
            "logo_name" => body.logo_name,
        },
    );
    match res {
        Ok(_) => {
            let id = trans.last_insert_id();
            match id {
                Some(company_id) => {
                    let res = trans.exec_drop("insert into company_location (company_id,latitude,longitude,detail) values (:company_id,:latitude,:longitude,:detail)", params!{
                "company_id" => company_id,
                "latitude" => body.location.latitude,
                "longitude" => body.location.longitude,
                "detail" => "",
                });
                    match after_update(trans, res).await {
                        Ok(_) => Ok("Create Success".to_string()),
                        Err(e) => Err(e),
                    }
                }
                None => {
                    trans.rollback().unwrap();
                    Err(MyError::no_changes_happen())
                }
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn edit_company(
    conn: &mut PooledConn,
    body: UpdateCompanyStudioReq,
) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = batch_exec(&mut trans,vec![
        BatchExec {
            stmt:"update company_studios set name=:name,logo_url=:logo_url,e_tag=:e_tag,logo_name=:logo_name,description=:description,region=:region,founder=:founder",
            params:  params! {
                "name" => body.name,
                "logo_url" => body.logo_url,
                "description" => body.description,
                "region" => body.region,
                "founder" => body.founder,
                "established_time" => body.established_time,
                "id" => body.id,
                "e_tag" => body.e_tag,
                "logo_name" => body.logo_name,
            },
        },
        BatchExec {
            stmt:"update company_location set latitude=:latitude,longitude=:longitude,detail=:detail where company_id=:company_id;",
            params:  params! {
                "latitude" => body.location.latitude,
                "longitude" => body.location.longitude,
                "detail" => "unknown",
                "company_id" => body.id,
            },
        }
    ]);
    match after_update(trans, res).await {
        Ok(_) => Ok("Edit Success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_company(
    conn: &mut PooledConn,
    req: GetCompanyStudioReq,
) -> Result<CompanyStudioLimitRes, MyError> {
    let sql_str = "select SQL_CALC_FOUND_ROWS id,name,logo_url,update_time,create_time,established_time from company_studios where (id=:id or :id is null) and (name=:name or :name is null) and (region=:region or :region is null) and (founder=:founder or :founder is null) order by update_time desc limit :scope,:limit";
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

pub async fn get_company_studio_detail(
    conn: &mut PooledConn,
    id: u64,
) -> Result<CompanyStudioDetail, MyError> {
    let sql_str = "select cs.*,cl.latitude as latitude,cl.longitude as longitude,cl.detail as location_detail from company_studios as cs left join company_location as cl on cl.company_id=cs.id where cs.id=:id";
    let res = conn.exec_first::<CompanyStudioDetailSql, &str, Params>(
        sql_str,
        params! {
            "id" => id
        },
    );
    match res {
        Ok(res) => match res {
            Some(res) => Ok(CompanyStudioDetail {
                id: res.id,
                name: res.name,
                e_tag: res.e_tag,
                logo_name: res.logo_name,
                logo_url: res.logo_url,
                description: res.description,
                region: res.region,
                founder: res.founder,
                update_time: res.update_time,
                create_time: res.create_time,
                established_time: res.established_time,
                location: CompanyLocationRes {
                    latitude: res.latitude,
                    longitude: res.longitude,
                    detail: res.location_detail,
                },
            }),
            None => Err(MyError::not_found()),
        },
        Err(err) => Err(MyError::sql_error(err)),
    }
}

pub async fn delete_company_studio(conn: &mut PooledConn, id: u64) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from company_studios where id=:id";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "id" => id
        },
    );
    match after_update(trans, res).await {
        Ok(_) => Ok("Delete Success".to_string()),
        Err(e) => Err(e),
    }
}

pub async fn get_company_list(conn: &mut PooledConn) -> Result<Vec<List>, MyError> {
    let sql_str = "select id as value,name as label from company_studios";
    let res = conn.query::<List, &str>(sql_str);
    match res {
        Ok(res) => Ok(res),
        Err(e) => Err(MyError::sql_error(e)),
    }
}
