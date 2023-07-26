#[allow(unused)]
pub fn string_to_str(string: String) -> &'static str {
    Box::leak(string.into_boxed_str())
}
