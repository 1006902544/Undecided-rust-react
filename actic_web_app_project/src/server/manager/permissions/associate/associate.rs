use mysql::{prelude::Queryable, PooledConn, TxOpts};

use crate::{
    app::error::MyError,
    schema::modules::manager::permission::associate::associate::{
        PermissionAssociateAuthReqBody, PermissionDisassociateAuthReqBody,
    },
};

pub async fn associate_permission_auth(
    conn: &mut PooledConn,
    body: PermissionAssociateAuthReqBody,
) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        format!(
            "insert into admin_permissions (uid,permission_id) values({},{})",
            body.uid, body.pid
        ),
        (),
    );
    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect > 0 {
                trans.commit().unwrap();
                Ok(1)
            } else {
                trans.rollback().unwrap();
                Err(MyError::edit_err())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}

pub async fn disassociate_permission_auth(
    conn: &mut PooledConn,
    query: PermissionDisassociateAuthReqBody,
) -> Result<u8, MyError> {
    let mut trans = conn.start_transaction(TxOpts::default()).unwrap();
    let res = trans.exec_drop(
        format!(
            "delete from admin_permissions where uid={uid} and permission_id={pid}",
            uid = query.uid,
            pid = query.pid,
        ),
        (),
    );
    match res {
        Ok(_) => {
            let affect = trans.affected_rows();
            if affect > 0 {
                trans.commit().unwrap();
                Ok(0)
            } else {
                trans.rollback().unwrap();
                Err(MyError::delete_err())
            }
        }
        Err(e) => {
            trans.rollback().unwrap();
            Err(MyError::sql_error(e))
        }
    }
}
