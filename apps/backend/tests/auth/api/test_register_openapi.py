import yaml


def test_openapi_declares_register_endpoint_contract(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = yaml.safe_load(response.content)
    register_operation = openapi["paths"]["/api/auth/register"]["post"]

    assert register_operation["operationId"] == "register_user_register_post"
    assert register_operation["requestBody"]["content"]["application/json"][
        "schema"
    ] == {"$ref": "#/components/schemas/RegisterUserRequest"}
    assert register_operation["responses"]["201"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/RegisterUserResponse"}
    assert register_operation["responses"]["400"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/ValidationErrorResponse"}
    assert register_operation["responses"]["409"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}
    assert register_operation["responses"]["422"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/HTTPValidationError"}


def test_openapi_declares_register_request_and_response_schemas(
    client,
) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = yaml.safe_load(response.content)["components"]["schemas"]

    assert schemas["RegisterUserRequest"]["required"] == ["email", "password"]
    assert schemas["RegisterUserRequest"]["properties"]["email"]["format"] == (
        "email"
    )
    assert schemas["RegisterUserRequest"]["properties"]["password"]["type"] == (
        "string"
    )

    assert set(schemas["RegisterUserResponse"]["required"]) == {
        "id",
        "email",
        "created_at",
        "is_active",
    }
    assert schemas["RegisterUserResponse"]["properties"]["id"]["type"] == (
        "string"
    )
    assert schemas["RegisterUserResponse"]["properties"]["email"]["type"] == (
        "string"
    )
    assert schemas["RegisterUserResponse"]["properties"]["created_at"][
        "type"
    ] == "string"
    assert schemas["RegisterUserResponse"]["properties"]["is_active"][
        "type"
    ] == "boolean"

    assert schemas["ValidationErrorResponse"]["required"] == ["detail"]
    assert schemas["ValidationErrorResponse"]["properties"]["detail"] == {
        "items": {"$ref": "#/components/schemas/ValidationIssueResponse"},
        "type": "array",
    }
    assert schemas["ValidationIssueResponse"]["required"] == [
        "field",
        "message",
    ]
