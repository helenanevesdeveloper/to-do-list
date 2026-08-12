"""OpenAPI integration for auth presentation components."""

from drf_spectacular.extensions import OpenApiAuthenticationExtension
from drf_spectacular.plumbing import build_bearer_security_scheme_object


class JwtAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = "app.auth.presentation.drf_authentication.JwtAuthentication"
    name = "jwtAuth"

    def get_security_definition(self, auto_schema):
        return build_bearer_security_scheme_object(
            header_name="Authorization",
            token_prefix="Bearer",
            bearer_format="JWT",
        )
