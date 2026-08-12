"""OpenAPI contract tests for the task-category create endpoint."""

import yaml


def test_openapi_declares_create_task_category_endpoint_contract(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = yaml.safe_load(response.content)
    operation = openapi["paths"]["/api/tasks/categories/"]["post"]

    assert operation["operationId"] == "tasks_create_task_category_post"
    assert operation["requestBody"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/TaskCategoryCreateRequest"
    }
    assert operation["responses"]["201"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/TaskCategoryItemResponse"
    }


def test_openapi_declares_create_task_category_request_and_response_schemas(
    client,
) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = yaml.safe_load(response.content)["components"]["schemas"]

    assert schemas["TaskCategoryCreateRequest"]["required"] == ["name"]
    assert schemas["TaskCategoryCreateRequest"]["properties"]["name"]["maxLength"] == 120
    assert schemas["TaskCategoryCreateRequest"]["properties"]["color"]["maxLength"] == 32

    assert set(schemas["TaskCategoryItemResponse"]["required"]) == {
        "id",
        "name",
        "color",
        "created_at",
        "updated_at",
    }
