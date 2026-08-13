"""OpenAPI contract tests for the task-category list endpoint."""

import yaml


def test_openapi_declares_list_task_categories_endpoint_contract(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    openapi = yaml.safe_load(response.content)
    operation = openapi["paths"]["/api/tasks/categories/"]["get"]

    assert operation["operationId"] == "tasks_list_task_categories_get"
    assert operation["responses"]["200"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/TaskCategoryListResponse"
    }


def test_openapi_declares_list_task_categories_response_schema(client) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schemas = yaml.safe_load(response.content)["components"]["schemas"]

    assert set(schemas["TaskCategoryListResponse"]["required"]) == {
        "count",
        "results",
    }
    assert schemas["TaskCategoryListResponse"]["properties"]["count"]["type"] == "integer"
    assert schemas["TaskCategoryListResponse"]["properties"]["results"] == {
        "items": {"$ref": "#/components/schemas/TaskCategoryItemResponse"},
        "type": "array",
    }
