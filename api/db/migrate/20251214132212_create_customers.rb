class CreateCustomers < ActiveRecord::Migration[8.1]
  def change
    create_table :customers do |t|
      t.string :name
      t.string :email
      t.string :tel
      t.string :postal_code
      t.string :address

      t.timestamps
    end

    add_index :customers, :name
  end
end
