use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "$CARGO_MANIFEST_DIR/assets/images/"]
#[include = "images/*"]
pub struct Images;

#[derive(RustEmbed)]
#[folder = "assets/config/"]
pub struct Config;
