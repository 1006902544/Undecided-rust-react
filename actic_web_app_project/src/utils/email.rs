use lettre::{
    message::header::ContentType,
    transport::smtp::{authentication::Credentials, Error},
    Message, SmtpTransport, Transport,
};

#[allow(unused)]
pub fn send_email(to: String, subject: String, body: String) -> Result<(), Error> {
    let email = Message::builder()
        .from("From <1006902544@qq.com>".parse().unwrap())
        .to(format!("To <{}>", to).parse().unwrap())
        .subject(subject)
        .header(ContentType::TEXT_PLAIN)
        .body(body)
        .unwrap();

    let creds = Credentials::new(
        "1006902544@qq.com".to_owned(),
        "xfwprpiaxbugbcei".to_owned(),
    );

    let mailer = SmtpTransport::relay("smtp.qq.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}
