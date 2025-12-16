# frozen_string_literal: true

class Customer < ApplicationRecord
  validates :name, presence: true, length: { maximum: 255 }

  validates :email,
            length: { maximum: 255 },
            format: { with: URI::MailTo::EMAIL_REGEXP },
            allow_blank: true

  validates :tel,
            length: { maximum: 30 },
            format: { with: /\A[0-9+\-() ]+\z/ },
            allow_blank: true

  validates :postal_code,
            length: { maximum: 8 },
            format: { with: /\A\d{3}-?\d{4}\z/ },
            allow_blank: true

  validates :address, length: { maximum: 500 }, allow_blank: true
end
