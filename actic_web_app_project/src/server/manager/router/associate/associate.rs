use crate::{
    app::error::MyError,
    schema::modules::manager::router::associate::associate::AssociateRouterAuthReq,
};
use mysql::{prelude::Queryable, PooledConn, TxOpts};
use mysql_common::params;

pub async fn associate_auth_router(
    conn: &mut PooledConn,
    body: AssociateRouterAuthReq,
) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "insert into admin_router (rkey,aid) values (:rkey,:aid)";
    let res = trans.exec_drop(
        sql_str,
        params! {
          "rkey" => body.rkey,
          "aid" => body.aid
        },
    );
    match res {
        Ok(_) => {
            let affect = trans.affected_rows() as u8;
            if affect > 0 {
                trans.commit().unwrap();
                Ok(affect)
            } else {
                trans.rollback().unwrap();
                Err(MyError::no_changes_happen())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn disassociate_auth_router(
    conn: &mut PooledConn,
    body: AssociateRouterAuthReq,
) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let sql_str = "delete from admin_router where rkey=:rkey and aid=:aid";
    let res = trans.exec_drop(
        sql_str,
        params! {
            "rkey" => body.rkey,
            "aid" => body.aid
        },
    );
    match res {
        Ok(_) => {
            let affect = trans.affected_rows() as u8;
            if affect > 0 {
                trans.commit().unwrap();
                Ok(affect)
            } else {
                trans.rollback().unwrap();
                Err(MyError::no_changes_happen())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}
