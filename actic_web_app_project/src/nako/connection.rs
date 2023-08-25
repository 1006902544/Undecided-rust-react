use crate::app::error::MyError;
use actix_web::web::Data;
use mysql::{prelude::Queryable, Error, Params, Pool, PooledConn, Transaction};
use mysql_common::params;

pub fn get_conn(pool: Data<Pool>) -> Result<PooledConn, MyError> {
    let conn = pool.as_ref().get_conn();
    match conn {
        Ok(c) => Ok(c),
        Err(e) => Err(MyError::sql_error(e)),
    }
}

pub fn handle_none(opt: &Option<impl ToString>, is_like: bool) -> String {
    match opt {
        Some(opt) => {
            let str = opt.clone().to_string();
            if str == "".to_string() {
                "null".to_string()
            } else {
                let str_or_num = str.parse::<u128>();
                match str_or_num {
                    Ok(num) => num.to_string(),
                    Err(_) => {
                        if is_like {
                            format!("'%{str}%'")
                        } else {
                            format!("'{str}'")
                        }
                    }
                }
            }
        }
        None => "null".to_string(),
    }
}

pub fn get_total(conn: &mut PooledConn) -> u128 {
    let total: Result<Option<u128>, mysql::Error> =
        conn.query_first("SELECT FOUND_ROWS() as total");
    match total {
        Ok(total) => match total {
            Some(total) => total,
            None => 0,
        },
        Err(_) => 0,
    }
}

pub fn get_current(total: u128, page: u128, limit: u128) -> u128 {
    if total == 0 {
        return 1;
    }
    let total_page = (total as f64 / limit as f64).ceil();
    if total_page > page as f64 {
        return page;
    } else {
        return total_page as u128;
    }
}

pub fn after_update<T>(trans: Transaction<'_>, res: Result<T, Error>) -> Result<T, MyError> {
    match res {
        Ok(res) => {
            let row = trans.affected_rows();
            if row > 0 {
                trans.commit().unwrap();
                Ok(res)
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

#[derive(Debug, Clone)]
pub struct BatchHandler<T> {
    pub items: Vec<T>,
}

impl<T> BatchHandler<T> {
    #[allow(unused)]
    pub fn new(items: Vec<T>) -> Self {
        BatchHandler { items }
    }

    #[allow(unused)]
    pub fn get_params(&self, handler: fn(&T) -> Vec<BatchHandlerObject>) -> Vec<Params> {
        self.items
            .iter()
            .map(|x| {
                let objs = handler(x);
                objs.iter()
                    .map(|obj| {
                        params! {obj.key.clone() => obj.value.clone()}
                    })
                    .collect()
            })
            .collect::<Vec<Vec<Params>>>()
            .concat()
    }

    #[allow(unused)]
    pub fn get_sql_str(&self, handler: fn(&T) -> String) -> String {
        self.items
            .iter()
            .map(|x: &T| {
                let string = handler(x);
                format!("({})", string)
            })
            .collect::<Vec<String>>()
            .join(",")
    }

    #[allow(unused)]
    pub fn custom_handle<F>(&self, handler: fn(&T) -> F) -> Vec<F> {
        self.items.iter().map(|x| handler(x)).collect::<Vec<F>>()
    }

    #[allow(unused)]
    pub fn new_batch_handler_object(key: String, value: String) -> BatchHandlerObject {
        BatchHandlerObject { key, value }
    }
}

pub struct BatchHandlerObject {
    pub key: String,
    pub value: String,
}
