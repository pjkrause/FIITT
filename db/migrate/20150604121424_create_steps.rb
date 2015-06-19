class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.text :general_message
      t.text :status_message

      t.timestamps null: false
    end
  end
end
