# frozen_string_literal: true

module Api
  class BaseController < ApplicationController
    
    protect_from_forgery with: :null_session if respond_to?(:protect_from_forgery)

    rescue_from ActiveRecord::RecordNotFound do
      render_error(code: "not_found", message: "Not found", status: :not_found)
    end

    rescue_from ActionController::ParameterMissing do |e|
      render_error(code: "bad_request", message: e.message, status: :bad_request)
    end

    private

    def render_validation_error(record)
      fields = record.errors.messages.transform_keys(&:to_s)
      render json: { error: { code: "validation_error", message: "Validation failed", fields: fields } },
             status: :unprocessable_entity
    end

    def render_error(code:, message:, status:)
      render json: { error: { code: code, message: message } }, status: status
    end
  end
end
