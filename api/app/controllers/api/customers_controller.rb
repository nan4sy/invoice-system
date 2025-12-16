# frozen_string_literal: true

module Api
  class CustomersController < BaseController
    def index
      customers = Customer.order(:id)
      render json: customers
    end

    def show
      render json: Customer.find(params[:id])
    end

    def create
      customer = Customer.new(customer_params)
      if customer.save
        render json: customer, status: :created
      else
        render_validation_error(customer)
      end
    end

    def update
      customer = Customer.find(params[:id])
      if customer.update(customer_params)
        render json: customer
      else
        render_validation_error(customer)
      end
    end

    def destroy
      Customer.find(params[:id]).destroy!
      head :no_content
    end

    private

   def customer_params
  permitted = %i[name email tel postal_code address]

  if params.key?(:customer)
    params.fetch(:customer, ActionController::Parameters.new).permit(*permitted)
  else
    params.permit(*permitted)
  end
end
  end
end
