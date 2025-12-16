# frozen_string_literal: true

require "test_helper"

class HealthControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get health_url
    assert_response :success
  end
end
