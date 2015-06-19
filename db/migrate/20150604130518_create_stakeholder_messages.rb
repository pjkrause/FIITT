class CreateStakeholderMessages < ActiveRecord::Migration
  def change
    create_table :stakeholder_messages do |t|
      t.integer :step_id
      t.string :source
      t.text :message

      t.timestamps null: false
    end
  end
end
