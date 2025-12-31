# frozen_string_literal: true

class Invoice < ApplicationRecord
  STATUSES = %w[draft issued sent paid canceled].freeze

  belongs_to :customer

  validates :invoice_number, presence: true, uniqueness: true
  validates :customer, :title, :invoice_date, :due_date, presence: true
  validates :status, inclusion: { in: STATUSES }

  validates :billing_name, :billing_postal_code, :billing_address, :billing_tel, :billing_person_in_charge, presence: true

  before_validation :assign_billing_snapshot, on: :create
  before_validation :assign_invoice_number, on: :create

  private

  def assign_billing_snapshot
    return unless customer

    self.billing_name ||= customer.name
    self.billing_postal_code ||= customer.postal_code
    self.billing_address ||= customer.address
    self.billing_tel ||= customer.tel
    self.billing_person_in_charge ||= customer.person_in_charge
  end

  def assign_invoice_number
    return if invoice_number.present?

    prefix = Time.zone.now.strftime("INV-%Y%m%d-")
    10.times do
      candidate = prefix + SecureRandom.alphanumeric(6).upcase
      next if self.class.exists?(invoice_number: candidate)

      self.invoice_number = candidate
      return
    end

    # 10回衝突するのは異常。静かに進めず落とす。
    raise "Failed to generate unique invoice_number"
  end
end
