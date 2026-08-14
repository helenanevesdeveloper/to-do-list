"""OpenAPI helpers shared across DRF presentation modules."""

import itertools
from typing import Any

from drf_spectacular.openapi import AutoSchema
from drf_spectacular.plumbing import build_media_type_object
from drf_spectacular.utils import OpenApiRequest


class DeleteRequestBodyAutoSchema(AutoSchema):
    """Allow documented request bodies for DELETE endpoints when explicitly declared."""

    def _get_request_body(self, direction="request"):
        if self.method not in ("PUT", "PATCH", "POST", "DELETE"):
            return None

        request_serializer = self.get_request_serializer()
        request_body_required = True
        content = []

        if isinstance(request_serializer, dict):
            media_types_iter = request_serializer.items()
        else:
            media_types_iter = zip(
                self.map_parsers(), itertools.repeat(request_serializer)
            )

        for media_type, serializer in media_types_iter:
            if isinstance(serializer, OpenApiRequest):
                serializer, examples, encoding = (
                    serializer.request,
                    serializer.examples,
                    serializer.encoding,
                )
            else:
                encoding, examples = None, None

            examples = self._get_examples(serializer, direction, media_type, None, examples)
            schema, partial_request_body_required = self._get_request_for_media_type(
                serializer, direction
            )

            if schema is not None:
                content.append((media_type, schema, examples, encoding))
                request_body_required &= partial_request_body_required

        if not content:
            return None

        request_body: dict[str, Any] = {
            "content": {
                media_type: build_media_type_object(schema, examples, encoding)
                for media_type, schema, examples, encoding in content
            }
        }
        if request_body_required:
            request_body["required"] = request_body_required
        return request_body
