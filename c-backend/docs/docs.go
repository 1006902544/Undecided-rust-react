// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/api/user/captcha/send": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "SendCaptchaToEmail",
                "parameters": [
                    {
                        "description": "body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/captcha.SendCaptchaReq"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "$ref": "#/definitions/response.RestfulResponse"
                        }
                    }
                }
            }
        },
        "/api/user/captcha/verify": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "EmailVerify",
                "parameters": [
                    {
                        "description": "body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/captcha.VerifyCaptchaReq"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "$ref": "#/definitions/response.RestfulResponse"
                        }
                    }
                }
            }
        },
        "/api/user/signUp": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "User"
                ],
                "summary": "SignUp",
                "parameters": [
                    {
                        "description": "body",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/user.UserSignUpReq"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/response.RestfulResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "data": {
                                            "type": "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "captcha.SendCaptchaReq": {
            "type": "object",
            "required": [
                "email"
            ],
            "properties": {
                "email": {
                    "type": "string"
                }
            }
        },
        "captcha.VerifyCaptchaReq": {
            "type": "object",
            "required": [
                "captcha",
                "email"
            ],
            "properties": {
                "captcha": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                }
            }
        },
        "response.RestfulResponse": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer"
                },
                "data": {},
                "message": {
                    "type": "string"
                }
            }
        },
        "user.UserCreateOrUpdateInfoReq": {
            "type": "object",
            "required": [
                "id",
                "nickname",
                "region",
                "username"
            ],
            "properties": {
                "avatarUrl": {
                    "type": "string"
                },
                "birthday": {
                    "type": "string"
                },
                "createTime": {
                    "type": "string"
                },
                "gender": {
                    "type": "integer"
                },
                "id": {
                    "type": "integer"
                },
                "mobile": {
                    "type": "integer"
                },
                "nickname": {
                    "type": "string"
                },
                "region": {
                    "type": "string"
                },
                "updateTime": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "user.UserSignUpAccountReq": {
            "type": "object",
            "required": [
                "captcha",
                "email",
                "password",
                "username"
            ],
            "properties": {
                "captcha": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "user.UserSignUpReq": {
            "type": "object",
            "required": [
                "type"
            ],
            "properties": {
                "account": {
                    "$ref": "#/definitions/user.UserSignUpAccountReq"
                },
                "info": {
                    "$ref": "#/definitions/user.UserCreateOrUpdateInfoReq"
                },
                "type": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "",
	Host:             "",
	BasePath:         "",
	Schemes:          []string{},
	Title:            "",
	Description:      "",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
