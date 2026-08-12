"""OpenAPI contract tests for the logout endpoint."""

import yaml


def test_openapi_declares_logout_endpoint_contract(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = yaml.safe_load(response.content)
    logout_operation = openapi["paths"]["/api/auth/logout"]["post"]
    security_schemes = openapi["components"]["securitySchemes"]

    assert logout_operation["operationId"] == "logout_user_logout_post"
    assert "requestBody" not in logout_operation
    assert logout_operation["security"] == [{"jwtAuth": []}]
    assert security_schemes["jwtAuth"] == {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }
    assert logout_operation["responses"]["401"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}
