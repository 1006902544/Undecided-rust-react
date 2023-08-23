use mysql::{from_row, prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{get_current, get_total},
    schema::{
        base_struct::handle_limit,
        modules::manager::{
            manager_response::{LimitResults, MaterialImageLimitRes},
            material_library::images::*,
        },
    },
    server::manager::game_center::general::tags::tags::after_update,
};

pub async fn create_image(
    conn: &mut PooledConn,
    params: UpdateImageObjectReq,
) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str =
        "insert into images (e_tag,file_name,file_url) values (:e_tag,:file_name,:file_url)";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "e_tag" => params.e_tag,
            "file_name" => params.file_name,
            "file_url" => params.file_url,
        },
    );
    after_update(trans, res).await
}

pub async fn delete_image(conn: &mut PooledConn, file_name: String) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from images where file_name=:file_name";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "file_name" => file_name,
        },
    );
    after_update(trans, res).await
}

pub async fn get_images(
    conn: &mut PooledConn,
    query: MaterialImageLimitReq,
) -> Result<MaterialImageLimitRes, MyError> {
    let limit = handle_limit(&query.limit);
    let page = handle_limit(&query.page);
    let res: Result<Vec<ImagesObject>, mysql::Error> = conn.exec_map(
        "select SQL_CALC_FOUND_ROWS * from images where (e_tag=:e_tag or :e_tag is null) order by create_time desc limit :scope,:limit",
        params! {
        "e_tag" => query.e_tag,
        "scope" => limit*(page-1),
        "limit" => limit,
        },
        |row| from_row(row),
    );
    match res {
        Ok(results) => {
            let total = get_total(conn);
            let current = get_current(total, page, limit);
            Ok(LimitResults {
                total,
                current,
                results: Some(results),
            })
        }
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub async fn batch_delete_images(
    conn: &mut PooledConn,
    query: BatchDeleteMaterialImagesReq,
) -> Result<String, MyError> {
    let sql = "delete from images where file_name in :filenames";
    let res = conn.exec_drop(
        sql,
        params! {
            "filenames" => query.filenames.join(",")
        },
    );
    match res {
        Ok(_) => Ok("Delete success".to_string()),
        Err(e) => Err(MyError::sql_error(e)),
    }
}
