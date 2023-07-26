use crate::app::error::MyError;

pub fn string_num(str: String) -> Result<u128, MyError> {
    match str.parse::<u128>() {
        Ok(s) => Ok(s),
        Err(e) => Err(MyError::type_err(e.to_string())),
    }
}
