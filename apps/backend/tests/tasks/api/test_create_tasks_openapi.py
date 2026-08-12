"""OpenAPI contract tests for the task-create endpoint."""

import yaml


def test_openapi_declares_create_tasks_endpoint_contract(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = yaml.safe_load(response.content)
    operation = openapi["paths"]["/api/tasks/"]["post"]

    assert operation["operationId"] == "tasks_create_tasks_post"
    assert operation["requestBody"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/TaskCreateRequest"
    }
    assert operation["responses"]["201"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/TaskCreateResponse"
    }


def test_openapi_declares_create_tasks_request_and_response_schemas(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = yaml.safe_load(response.content)["components"]["schemas"]

    assert schemas["TaskCreateRequest"]["required"] == ["items"]
    assert schemas["TaskCreateRequest"]["properties"]["items"] == {
        "items": {"$ref": "#/components/schemas/TaskCreateItemRequest"},
        "type": "array",
    }

    assert set(schemas["TaskCreateItemRequest"]["required"]) == {"title"}
    assert schemas["TaskCreateItemRequest"]["properties"]["title"]["maxLength"] == 255
    assert (
        schemas["TaskCreateItemRequest"]["properties"]["is_completed"]["type"]
        == "boolean"
    )

    assert set(schemas["TaskCreateResponse"]["required"]) == {
        "count",
        "results",
    }
    assert schemas["TaskCreateResponse"]["properties"]["count"]["type"] == "integer"
    assert schemas["TaskCreateResponse"]["properties"]["results"] == {
        "items": {"$ref": "#/components/schemas/TaskItemResponse"},
        "type": "array",
    }
