use once_cell::sync::Lazy;

use std::sync::Mutex;

static _GLOBAL_ONCE_FILE: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new(String::from("conf.ini")));

// static GLOBAL_ONCE = Lazy::new(|| {
//   let conf = match Config::get(GLOBAL_ONCE_FILE.clone()) {
//       Some(conf) => conf.data.into_owned(),
//       None => todo!()
//   };
// })
