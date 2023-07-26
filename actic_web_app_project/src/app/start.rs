use crate::{
    middleware::{auth_verify::Auth, err_res_middleware::ErrorResponse, response::MyResponse},
    nako::auth::get_unless_tree,
    routes::{admin::admin_config, manager::manager_config},
};
use actix_cors::Cors;
use actix_web::{get, middleware::Logger, web::Data, App, HttpServer};
use dotenv::dotenv;
use env_logger::Env;
use mysql::*;
use std::env;

#[get("/")]
async fn index() -> String {
    String::from("Welcome")
}

pub async fn start() -> std::io::Result<()> {
    //控制台打印级别: info
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    //配置env
    dotenv().ok();

    //获取地址
    let port = match env::var("PORT") {
        Ok(port) => port,
        Err(_) => String::from("8080"),
    };
    let host = match env::var("Host") {
        Ok(port) => port,
        Err(_) => String::from("127.0.0.1"),
    };
    let address = format!("{}:{}", host, port);
    println!("running at {address}");

    //mysql
    let sql_address = match env::var("SQL_ADDRESS") {
        Ok(port) => port,
        Err(_) => "mysql://root:password@localhost:3306".to_string(),
    };
    let pool = Pool::new(sql_address.as_str())
        // .unwrap_or_else(|e| panic!("failed connect to mysql: {}", e.to_string()));
        .unwrap_or_else(|e| panic!("{}", e.to_string()));

    HttpServer::new(move || {
        //配置cors
        let cors = Cors::default()
            // .allowed_header("Authorization")
            .allow_any_header()
            .allow_any_origin()
            .allow_any_method();

        App::new()
            .wrap(ErrorResponse)
            // .app_data(get_unless())
            .app_data(get_unless_tree())
            .wrap(Auth)
            .wrap(MyResponse)
            .app_data(Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(Logger::new("%s %{User-Agent}i"))
            .wrap(cors)
            .service(index)
            .configure(admin_config)
            .configure(manager_config)
        // .wrap(from_fn(verify_auth))
    })
    .bind(address)?
    .run()
    .await
}
