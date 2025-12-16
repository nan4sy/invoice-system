# frozen_string_literal: true

require "test_helper"

class ApiCustomersTest < ActionDispatch::IntegrationTest
  test "GET /api/customers returns 200" do
    get "/api/customers"
    assert_response :success
  end

  test "POST /api/customers creates customer (201)" do
    post "/api/customers",
         params: { customer: { name: "ACME", email: "test@example.com" } }.to_json,
         headers: { "Content-Type" => "application/json" }

    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "ACME", body["name"]
    assert body["id"].present?
  end

  test "POST /api/customers with missing name returns 422 with fields" do
    post "/api/customers",
         params: { customer: { } }.to_json,
         headers: { "Content-Type" => "application/json" }

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_equal "validation_error", body.dig("error", "code")
    assert body.dig("error", "fields", "name").present?
  end
end
