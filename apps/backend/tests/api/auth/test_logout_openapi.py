from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_openapi_declares_logout_endpoint_contract(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = response.json()
    logout_operation = openapi["paths"]["/logout"]["post"]

    assert logout_operation["operationId"] == "logout_user_logout_post"
    assert "requestBody" not in logout_operation
    assert logout_operation["responses"]["204"]["description"] == (
        "Successful Response"
    )
    assert logout_operation["responses"]["401"]["content"][
        "application/json"
    ]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}
    assert logout_operation["security"] == [{"HTTPBearer": []}]
