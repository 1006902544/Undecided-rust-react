use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

use crate::{
    app::error::MyError,
    nako::connection::{BatchHandler, BatchHandlerObject},
    schema::{
        base_struct::{handle_limit, handle_page},
        modules::manager::game_center::game_management::spu::spu::*,
    },
};

pub async fn create_spu(conn: &mut PooledConn, params: UpdateSpuReq) -> Result<String, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let insert_spu = "insert into spus name,company_id,price,description,issue_time values (:name,:company_id,:price,:description,:issue_time)";
    let insert_spu_res = trans.exec_drop(
        insert_spu,
        params! {
            "name" => params.name,
            "company_id" => params.company_id,
            "price" => params.price,
            "description" => params.description,
            "issue_time" => params.issue_time,
        },
    );
    match insert_spu_res {
        Ok(()) => {
            let id = trans.last_insert_id();
            match id {
                Some(id) => {
                    //---存储插入结果，有一个错误就抛出并rollback
                    let mut res_arr = vec![];
                    //---插入封面
                    let insert_cover = "insert into spus_cover cover_url,cover_name,spu_id";
                    let insert_cover_res = trans.exec_drop(
                        insert_cover,
                        params! {
                            "cover_url" => params.cover.url,
                            "cover_name" => params.cover.name,
                            "spu_id" => id,
                        },
                    );
                    res_arr.push(insert_cover_res);
                    //---插入轮播
                    let carousel_batch_handler = BatchHandler::new(params.carousel);
                    let insert_carousel = format!(
                        "insert ignore into spus_carousel (cover_url,cover_name,spu_id) values {}",
                        carousel_batch_handler
                            .get_sql_str(|c| { format!(":{},:{}", c.name, c.url) })
                    );
                    let carousel_sql_params = carousel_batch_handler.get_params(|c| {
                        vec![
                            BatchHandler::<SpuFileObject>::new_batch_handler_object(
                                c.name.clone(),
                                c.name.clone(),
                            ),
                            BatchHandler::<SpuFileObject>::new_batch_handler_object(
                                c.url.clone(),
                                c.url.clone(),
                            ),
                        ]
                    });
                    let insert_carousel_res =
                        trans.exec_batch(insert_carousel, carousel_sql_params);
                    res_arr.push(insert_carousel_res);
                    //---插入tags
                    let tags_batch_handler = BatchHandler::new(params.tag_ids);
                    let insert_tags = format!(
                        "insert ignore into spus_tags (spu_id,tag_id) values {}",
                        tags_batch_handler.get_sql_str(|t| { format!(":{},:spu_id", t) })
                    );
                    let mut tags_sql_params = tags_batch_handler.get_params(|tag_id| {
                        vec![BatchHandlerObject {
                            key: tag_id.to_string(),
                            value: tag_id.to_string(),
                        }]
                    });
                    tags_sql_params.push(params! {"spu_id" => id});
                    let insert_tags_res = trans.exec_batch(insert_tags, tags_sql_params);
                    res_arr.push(insert_tags_res);
                    //---插入types
                    let types_batch_handler = BatchHandler::new(params.type_ids);
                    let insert_types = format!(
                        "insert ignore into spus_types (spu_id,type_id) values {}",
                        tags_batch_handler.get_sql_str(|t| { format!(":{},:spu_id", t) })
                    );
                    let mut types_sql_params = types_batch_handler.get_params(|type_id| {
                        vec![BatchHandlerObject {
                            key: type_id.to_string(),
                            value: type_id.to_string(),
                        }]
                    });
                    types_sql_params.push(params! {"spu_id" => id});
                    let insert_types_res = trans.exec_batch(insert_types, types_sql_params);
                    res_arr.push(insert_types_res);
                    //---判断结果
                    let mut err = None;
                    res_arr.into_iter().position(|r| match r {
                        Ok(_) => false,
                        Err(e) => {
                            err = Some(e);
                            true
                        }
                    });
                    match err {
                        Some(err) => {
                            trans.rollback().unwrap();
                            Err(MyError::sql_error(err))
                        }
                        None => {
                            trans.commit().unwrap();
                            Ok("Create success".to_string())
                        }
                    }
                }
                None => {
                    trans.rollback().unwrap();
                    Err(MyError::no_changes_happen())
                }
            }
        }
        Err(err) => Err(MyError::sql_error(err)),
    }
}
