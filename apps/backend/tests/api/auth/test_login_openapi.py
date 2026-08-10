from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_openapi_declares_login_endpoint_contract(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = response.json()
    login_operation = openapi["paths"]["/login"]["post"]

    assert login_operation["operationId"] == "login_user_login_post"
    assert login_operation["requestBody"]["content"]["application/json"][
        "schema"
    ] == {"$ref": "#/components/schemas/LoginRequest"}
    assert login_operation["responses"]["200"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/LoginResponse"}
    assert login_operation["responses"]["401"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}
    assert login_operation["responses"]["422"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/HTTPValidationError"}


def test_openapi_declares_login_request_and_response_schemas(
    client: TestClient,
) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = response.json()["components"]["schemas"]

    assert schemas["LoginRequest"]["required"] == ["email", "password"]
    assert schemas["LoginRequest"]["properties"]["email"]["format"] == (
        "email"
    )
    assert schemas["LoginRequest"]["properties"]["password"]["type"] == (
        "string"
    )

    assert schemas["LoginResponse"]["required"] == [
        "access_token",
        "token_type",
    ]
    assert schemas["LoginResponse"]["properties"]["access_token"]["type"] == (
        "string"
    )
    assert schemas["LoginResponse"]["properties"]["token_type"]["type"] == (
        "string"
    )
