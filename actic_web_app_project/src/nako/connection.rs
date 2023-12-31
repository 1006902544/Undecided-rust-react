use crate::app::error::MyError;
use actix_web::web::Data;
use mysql::{prelude::Queryable, Pool, PooledConn};

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
